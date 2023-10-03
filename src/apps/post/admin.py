from django.contrib import admin

from .models import (Post,
                     Like,
                     PostImage)

# Register your models here.


admin.site.register(Post)
admin.site.register(PostImage)
admin.site.register(Like)
