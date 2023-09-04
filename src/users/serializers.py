from rest_framework import serializers
from .models import (Profile, Followlist)
from django.contrib.auth import get_user_model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    following = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'followers', 'following', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class ProfileSerializer(serializers.ModelSerializer):
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ["user", "bio", "profile_pic", "public", "followers", "following"]

    def get_followers(self, obj):
        user = obj.user
        followers = Followlist.objects.filter(following=user, reqstatus='accepted')
        follower_user_ids = followers.values_list('follower_id', flat=True)
        follower_users = User.objects.filter(id__in=follower_user_ids)
        return UserSerializer(follower_users, many=True).data

    def get_following(self, obj):
        user = obj.user
        following = Followlist.objects.filter(follower=user, reqstatus='accepted')
        following_user_ids = following.values_list('following_id', flat=True)
        following_users = User.objects.filter(id__in=following_user_ids)
        return UserSerializer(following_users, many=True).data


class FollowListSerializer(serializers.Serializer):
    class Meta:
        model = Followlist
        fields = ['follower', 'following', 'reqstatus']
