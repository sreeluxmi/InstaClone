from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (UserRegistrationView, UserLoginView,
                    ProfileViewSet, PostViewSet,
                    FollowUser, UnfollowUser)


router = DefaultRouter()
router.register(r'profile', ProfileViewSet)
router.register(r'posts', PostViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('follow/<int:user_id>/', FollowUser.as_view(), name='follow-user'),
    path('unfollow/<int:user_id>/', UnfollowUser.as_view(), name='unfollow-user'),
]
