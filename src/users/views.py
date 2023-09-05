from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
# from rest_framework.renderers import TemplateHTMLRenderer
from django.contrib.auth import get_user_model

from .models import (Profile, Followlist)
from .serializers import (UserSerializer,
                          UserLoginSerializer,
                          ProfileSerializer,
                          FollowListSerializer)
User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        Profile.objects.create(user=user)


class UserLoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = User.objects.filter(username=username).first()
            if user is None or not user.check_password(password):
                return Response({'detail': 'Invalid credentials'},
                                status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({'access_token': access_token})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RetrieveUser(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UpdateUser(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        profile_data = serializer.data
        profile_data['followers'] = self.get_followers_list(instance)
        profile_data['following'] = self.get_following_list(instance)
        return Response(profile_data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        profiles_with_followers = []
        for profile_data in serializer.data:
            profile = Profile.objects.get(user_id=profile_data['user'])
            profile_data['followers'] = self.get_followers_list(profile)
            profile_data['following'] = self.get_following_list(profile)
            profiles_with_followers.append(profile_data)
        return Response(profiles_with_followers)

    def get_followers_list(self, profile):
        followers = Followlist.objects.filter(following=profile.user, reqstatus='accepted')
        follower_user_ids = followers.values_list('follower_id', flat=True)
        follower_users = User.objects.filter(id__in=follower_user_ids)
        return UserSerializer(follower_users, many=True).data

    def get_following_list(self, profile):
        following = Followlist.objects.filter(follower=profile.user, reqstatus='accepted')
        following_user_ids = following.values_list('following_id', flat=True)
        following_users = User.objects.filter(id__in=following_user_ids)
        return UserSerializer(following_users, many=True).data


class FollowRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        follower = request.user
        following_id = request.data.get('following_id')
        following = get_object_or_404(User, id=following_id)

        if follower == following:
            return Response({'detail': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            followlist = Followlist.objects.get(follower=follower, following=following)
            if followlist.reqstatus == 'accepted':
                return Response({'detail': 'You are already following this user.'}, status=status.HTTP_400_BAD_REQUEST)
            elif followlist.reqstatus == 'pending':
                return Response({'detail': 'You have a pending follow request to this user.'}, status=status.HTTP_400_BAD_REQUEST)
        except Followlist.DoesNotExist:
            pass

        if following.profile.public:
            Followlist.objects.create(follower=follower, following=following, reqstatus='accepted')
            return Response({'detail': 'You are now following this user.'}, status=status.HTTP_201_CREATED)
        else:
            Followlist.objects.create(follower=follower, following=following, reqstatus='pending')
            return Response({'detail': 'Following request sent and pending approval'}, status=status.HTTP_201_CREATED)


class AcceptFollowRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        following = request.user
        follower_id = request.data.get('follower_id')
        try:
            follower = User.objects.get(id=follower_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            followlist = Followlist.objects.get(follower=follower, following=following, reqstatus='pending')
        except Followlist.DoesNotExist:
            return Response({'detail': 'Friend request not found'}, status=status.HTTP_400_BAD_REQUEST)
        action = request.data.get('action')
        if action == 'accept':
            followlist.reqstatus = 'accepted'
            followlist.save()
            return Response({'detail': 'Friend request accepted'}, status=status.HTTP_200_OK)
        elif action == 'cancel':
            followlist.delete()
            return Response({'detail': 'Friend request canceled'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
