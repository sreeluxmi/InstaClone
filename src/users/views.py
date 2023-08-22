from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework.renderers import TemplateHTMLRenderer

from django.contrib.auth import get_user_model

from .models import Profile, Post, Follow
from .serializers import (UserSerializer, UserLoginSerializer,
                          ProfileSerializer, FollowSerializer,
                          PostSerializer,)
User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


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


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class FollowUser(APIView):
    def post(self, request, user_id, *args, **kwargs):
        follower = request.user
        followed = User.objects.get(pk=user_id)

        follow, created = Follow.objects.get_or_create(follower=follower, followed=followed)

        if created:
            return Response({'detail': 'User followed successfully.'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'User already followed.'}, status=status.HTTP_400_BAD_REQUEST)


class UnfollowUser(APIView):
    def post(self, request, user_id, *args, **kwargs):
        follower = request.user
        followed = User.objects.get(pk=user_id)

        Follow.objects.filter(follower=follower, followed=followed).delete()

        return Response({'detail': 'User unfollowed successfully.'}, status=status.HTTP_204_NO_CONTENT)
