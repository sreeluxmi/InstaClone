from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (signup, home, landingPage,
                    profile_view_page, profile_update,
                    profile_list, single_profile,
                    followers_list_view,
                    following_list_view,
                    pending_requests, image_posting,
                    UserRegistrationView, UserLoginView,
                    ProfileViewSet, FollowRequestView,
                    AcceptFollowRequest, Unfollow,
                    PostViewSet, FeedAPIView)


router = DefaultRouter()
router.register(r'profile', ProfileViewSet)
router.register(r'posts', PostViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
    path('signup/', signup, name="signup"),
    path('home/', home),
    path('feed/', landingPage, name="feed"),
    path('me/', profile_view_page, name="profile"),
    path('profile-update/', profile_update, name="profile-update"),
    path('profile-list/', profile_list, name="profile-list"),
    path('single-profile/<int:pk>/', single_profile, name="single-profile-view"),
    path('followers-list/', followers_list_view, name="followers-list"),
    path('following-list/', following_list_view, name="following-list"),
    path('pending-requests/', pending_requests, name="pending-requests"),
    path('image-posting/', image_posting, name="image-posting"),

    # API
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('loginAPI/', UserLoginView.as_view(), name='user-login'),
    path('follow_request/', FollowRequestView.as_view()),
    path('accept_request/', AcceptFollowRequest.as_view()),
    path('unfollow/<int:id>/', Unfollow.as_view(), name='unfollow-user'),
    path('feedAPI/', FeedAPIView.as_view(),)
]
