from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (UserRegistrationViewSet,
                    UserLoginViewSet,
                    ProfileViewSet,
                    PostViewSet)


router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'register', UserRegistrationViewSet, basename='user-registration')
router.register(r'login', UserLoginViewSet, basename='user-login')
router.register(r'profile', ProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
