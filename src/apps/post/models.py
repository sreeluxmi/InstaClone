from django.db import models
from core.models import BaseModel
from users.models import User

# Create your models here.


class Post(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    caption = models.TextField()
    likes = models.ManyToManyField(User, blank=True, related_name='liked_posts')

    def __str__(self):
        return f"Post by {self.user.username}"


class PostImage(BaseModel):
    post = models.ForeignKey(Post, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_images/')

    def __str__(self):
        return f"Image for {self.post}"


# class Like(BaseModel):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_likes')
#     post = models.ForeignKey(Posting, related_name='post_likes', on_delete=models.CASCADE)

#     def __str__(self):
#         return f"{self.user.username} likes {self.post}"
#     class Meta:
#         unique_together = ('user', 'post')
