from rest_framework import serializers
from .models import (Post,
                     PostImage)


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['post', 'image']


class PostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True
    )

    class Meta:
        model = Post
        fields = ['caption', 'images', "uploaded_images"]

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images')
        post = Post.objects.create(**validated_data)
        for uploaded_images in uploaded_images:
            PostImage.objects.create(post=post, image=uploaded_images)
        return post
