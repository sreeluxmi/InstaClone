from django.db import models
from core.models import BaseModel
from users.models import User

# Create your models here.


class Post(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    caption = models.TextField()

    def __str__(self):
        return f"Post by {self.user.username}"


class PostImage(BaseModel):
    post = models.ForeignKey(Post, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_images/')

    def __str__(self):
        return f"Image for {self.post}"
