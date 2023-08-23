from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (UserRegistrationView, UserLoginView,
                    ProfileViewSet,
                    FollowListViewSet)


router = DefaultRouter()
router.register(r'profile', ProfileViewSet)
router.register(r'follows', FollowListViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
]
