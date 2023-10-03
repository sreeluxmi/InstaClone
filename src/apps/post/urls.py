from django.urls import include, path
from rest_framework.routers import DefaultRouter

# LOCAL
from .apis import (LikeViewSet, PostViewSet,
                   FeedAPIView,)
from .views import (image_posting)

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'likes', LikeViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('image-posting/', image_posting, name="image-posting"),

    # API
    path('feedAPI/', FeedAPIView.as_view(),)
]
