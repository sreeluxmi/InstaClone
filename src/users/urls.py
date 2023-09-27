from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .apis import (UserRegistrationView,
                   UserLoginView,
                   ProfileViewSet,
                   FollowRequestView,
                   AcceptFollowRequest,
                   Unfollow)

from .views import (signup, home,
                    landingPage,
                    profile_view_page,
                    profile_update,
                    profile_list,
                    single_profile,
                    followers_list_view,
                    following_list_view,
                    pending_requests)


router = DefaultRouter()
router.register(r'profile', ProfileViewSet)
router.register(r'loginAPI', UserLoginView)
router.register(r'accept_request', AcceptFollowRequest)


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

    # API
    path('register/', UserRegistrationView.as_view(), name='user-registration'),

    path('follow_request/', FollowRequestView.as_view()),
    # path('accept_request/', AcceptFollowRequest.as_view()),
    path('unfollow/<int:id>/', Unfollow.as_view(), name='unfollow-user')
]
