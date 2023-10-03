from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
# LOCAL
from users.models import (Followlist)
from .models import (Post, PostImage, Like)
from .serializers import (PostSerializer, LikeSerializer)


class FeedAPIView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        user = self.request.user
        # following_users = Followlist.objects.get(follower=user, reqstatus='accepted')
        # print(following_users)
        following_users = Followlist.objects.filter(follower=user, reqstatus='accepted').values('following_id')

        return Post.objects.filter(user__id__in=following_users)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request):

        request.data['user'] = request.user.id
        uploaded_images = request.FILES.getlist('uploaded_images')
        post_serializer = self.get_serializer(data=request.data)
        if post_serializer.is_valid():
            post = post_serializer.save()
            for uploaded_images in uploaded_images:
                PostImage.objects.create(post=post, image=uploaded_images)
            return Response(post_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(post_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
