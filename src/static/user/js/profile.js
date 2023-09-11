
$(document).ready(function(){
    var access_token = localStorage.getItem('access_token');

    if (access_token){
        $.ajax({
            type:"GET",
            url : "/users/api/profile/",
            headers:{
                "Authorization" : "Bearer" + access_token
            },
            success: function (data) {
                console.log(data)
                $(".profile-name").text(data.name);
                $(".profile-stats-count:eq(0)").text(data.posts);
                $(".profile-stats-count:eq(1)").text(data.followers);
                $(".profile-stats-count:eq(2)").text(data.following);
                $(".profile-bio span").text(data.bio);
            },
            error: function (xhr) {
                console.log(xhr);
            }           
        })
    }
})