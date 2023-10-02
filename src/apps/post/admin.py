from django.contrib import admin

from .models import (Posting,
                     PostImage)

# Register your models here.


admin.site.register(Posting)
admin.site.register(PostImage)
