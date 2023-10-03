from rest_framework import serializers
from .models import (Post,
                     Like,
                     PostImage)


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['image', 'post']


class PostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        read_only=True
    )
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Post
        fields = ["user", "username", "caption", "images", "uploaded_images", "likes"]

    # def create(self, validated_data):
    #     uploaded_images = validated_data.pop('uploaded_images')
    #     user = self.context['request'].user
    #     print("user", user)
    #     post = Post.objects.create(user=user, **validated_data)
    #     for uploaded_images in uploaded_images:
    #         PostImage.objects.create(post=post, image=uploaded_images)
    #     return post


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['user', 'post']
