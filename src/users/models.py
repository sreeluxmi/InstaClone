from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    profile_pic = models.ImageField(upload_to='profiles/', blank=True, null=True, default="/profiles/defualt.jpg")
    public = models.BooleanField(default=True)  # True for public, False for private

    def __str__(self):
        return self.user.username


class Followlist(models.Model):
    STATUS_CHOICE = (   
        ('pending', 'Pending'),
        ('accepted', 'Accpeted'),
        ('rejected', 'Rejected')
    )
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    reqstatus = models.CharField(max_length=20, choices=STATUS_CHOICE, default='pending')

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"
