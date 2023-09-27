from django.shortcuts import render

# Create your views here.


def image_posting(request):
    return render(request, 'post/postImage.html')
