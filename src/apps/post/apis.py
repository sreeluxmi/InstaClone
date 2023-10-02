from rest_framework import generics, viewsets
from rest_framework.parsers import MultiPartParser, FormParser
# LOCAL
from users.models import (Followlist)
from .models import (Posting, Like)
from .serializers import (PostSerializer, LikeSerializer)


class FeedAPIView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        user = self.request.user
        print(user)
        # following_users = Followlist.objects.get(follower=user, reqstatus='accepted')
        # print(following_users)
        following_users = Followlist.objects.filter(follower=user, reqstatus='accepted').values('following_id')
        print(following_users)
        return Posting.objects.filter(user__id__in=following_users)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Posting.objects.all()
    serializer_class = PostSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer