# DJANGO
from django.shortcuts import render


def signup(request):
    return render(request, 'user/signup.html')


def home(request):
    return render(request, 'user/login.html')


def landingPage(request):
    return render(request, 'feed.html')


def profile_view_page(request):
    return render(request, 'user/profile.html')


def profile_update(request):
    return render(request, 'user/updatepro.html')


def profile_list(request):
    return render(request, "user/userlist.html")


def pending_requests(request):
    return render(request, "user/pendingReq.html")


def single_profile(request, pk):
    return render(request, 'user/singleProfile.html', {'id': pk})


def followers_list_view(request):
    return render(request, 'user/followerList.html')


def following_list_view(request):
    return render(request, "user/followingList.html")
