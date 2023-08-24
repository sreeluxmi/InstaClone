from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
# from rest_framework.renderers import TemplateHTMLRenderer

from django.contrib.auth import get_user_model

from .models import (Profile,Followlist)
from .serializers import (UserSerializer, UserLoginSerializer,
                          ProfileSerializer,FollowListSerializer)
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


class FollowRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        follower = request.user
        print("follower", follower)
        following_id = request.data.get('following_id')
        print("following_id", following_id)

        following = get_object_or_404(User, id=following_id)
        print("following", following)
        if follower != following:
            Followlist.objects.create(follower=follower,
                                      following=following)
            print("Request send")
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class AcceptFollowRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        following = request.user
        print("following 2", following)

        follower_id = request.data.get('follower_id')
        print("follower_id 2", follower_id)  # it is the id of requested person

        try:
            follower = User.objects.get(id=follower_id)
        except User.DoesNotExist:
            return Response({'detail': 'Follower not found'},
                            status=status.HTTP_400_BAD_REQUEST)
        # Ensure that the authenticated user (following) is the same as the user whose profile is being viewed (follower)

        follower = get_object_or_404(User, id=follower_id)
        print("follower 2", follower)

        followlist = Followlist.objects.get(follower=follower,
                                            following=following,
                                            status='pending')
        followlist.status = 'accepted'
        followlist.save()

        following.followers.add(follower)
        follower.following.add(following)

        return Response({'detail': 'Friend request accepted'}, status=status.HTTP_200_OK)
