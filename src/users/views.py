# DJANGO
from django.shortcuts import get_object_or_404, render
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import TemplateHTMLRenderer
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth import get_user_model

# LOCAL
from .models import (Profile, Followlist)
from .serializers import (UserSerializer,
                          UserLoginSerializer,
                          ProfileSerializer,)
from core.request_responses import *
User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'user/signup.html'

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
                # return Response({'detail': 'Invalid credentials'},
                #                 status=status.HTTP_401_UNAUTHORIZED)
                return JsonResponse({"detail": 'Invalid credentials'}, status=401)

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # return Response({'access_token': access_token})
            return JsonResponse({'redirect_url': '/users/feed/'}, status=200)
        else:
            # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return JsonResponse({'success': False}, status=400)


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
        print("instance", instance)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


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
            print(followlist)
            if followlist.reqstatus == 'accepted':
                return Response({'detail': FOLLOWING_EXISTS}, status=status.HTTP_400_BAD_REQUEST)
            elif followlist.reqstatus == 'pending':
                action = request.data.get('action')
                if action == 'cancel':
                    followlist.delete()
                    return Response({'detail': REQUEST_CANCELED}, status=status.HTTP_200_OK)
                return Response({'detail': PENDING_FOLLOW_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
        except Followlist.DoesNotExist:
            pass

        if following.profile.public:
            Followlist.objects.create(follower=follower, following=following, reqstatus='accepted')
            return Response({'detail': FOLLOWING_SUCCESS}, status=status.HTTP_201_CREATED)
        else:
            Followlist.objects.create(follower=follower, following=following, reqstatus='pending')
            action = request.data.get('action')
            if action == 'cancel':
                followlist.delete()
                return Response({'detail': REQUEST_CANCELED}, status=status.HTTP_200_OK)
            return Response({'detail': PENDING_APPROVAL}, status=status.HTTP_201_CREATED)


class AcceptFollowRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        following = request.user
        follower_id = request.data.get('follower_id')
        follower = get_object_or_404(User, id=follower_id)
        # try:
        #     follower = User.objects.get(id=follower_id)
        # except User.DoesNotExist:
        #     return Response({'detail': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        followlist = get_object_or_404(Followlist, follower=follower, following=following, reqstatus='pending')

        # try:
        #     followlist = Followlist.objects.get(follower=follower, following=following, reqstatus='pending')
        # except Followlist.DoesNotExist:
        #     return Response({'detail': REQUEST_NOT_FOUND }, status=status.HTTP_400_BAD_REQUEST)
        action = request.data.get('action')
        if action == 'accept':
            followlist.reqstatus = 'accepted'
            followlist.save()
            return Response({'detail': REQUEST_ACCEPTED}, status=status.HTTP_200_OK)
        elif action == 'cancel':
            followlist.delete()
            return Response({'detail': REQUEST_CANCELED}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)


class Unfollow(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        user_to_unfollow = get_object_or_404(User, id=id)
        following = Followlist.objects.get(follower=request.user, following=user_to_unfollow, reqstatus='accepted')
        if following:
            following.delete()
            return Response({"detail": "You have unfollowed ."})

        return Response({"detail": "You were not following them"}, status=status.HTTP_404_NOT_FOUND) 


def home(request):
    return render(request, 'user/login.html')


def landingPage(request):
    return render(request, 'feed.html')
