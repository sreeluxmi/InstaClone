from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email_or_phone = models.CharField(max_length=50)

    def __str__(self):
        return self.username


class Post(models.Model):
    post_img = models.ImageField(upload_to='posts/')
    caption = models.TextField()
