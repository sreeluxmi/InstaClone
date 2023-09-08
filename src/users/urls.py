from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (signup, home, landingPage, UserRegistrationView, UserLoginView,
                    ProfileViewSet, FollowRequestView,
                    AcceptFollowRequest, Unfollow)


router = DefaultRouter()
router.register(r'profile', ProfileViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
    path('signup/', signup, name="signup"),
    path('home/', home),
    path('feed/', landingPage, name="feed"),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('loginAPI/', UserLoginView.as_view(), name='user-login'),
    path('follow_request/', FollowRequestView.as_view()),
    path('accept_request/', AcceptFollowRequest.as_view()),
    path('unfollow/<int:id>/', Unfollow.as_view(), name='unfollow-user'),
]
