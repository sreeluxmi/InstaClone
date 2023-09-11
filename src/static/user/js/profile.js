
// $(document).ready(function(){
//     var access_token = localStorage.getItem('access_token');

//     if (access_token){
//         $.ajax({
//             type:"GET",
//             url : "/users/api/profile/",
//             headers:{
//                 "Authorization" : "Bearer" + access_token
//             },
//             success: function (data) {
//                 console.log(data)
//                 $(".profile-name").text(data.name);
//                 $(".profile-stats-count:eq(0)").text(data.posts);
//                 $(".profile-stats-count:eq(1)").text(data.followers);
//                 $(".profile-stats-count:eq(2)").text(data.following);
//                 $(".profile-bio span").text(data.bio);
//             },
//             error: function (xhr) {
//                 console.log(xhr);
//             }           
//         })
//     }
// })


$(document).ready(function () {
    var access_token = localStorage.getItem('access_token');

    if (access_token) {
        fetch("/users/api/profile/me/", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                console.log("User is not authenticated.");
            } else {
                throw new Error("An error occurred");
            }
        })
        .then(function (data) {
            console.log(data);
            $(".profile-name").text(data.user.username);  
            $(".profile-stats-count:eq(1)").text(data.followers.length); 
            $(".profile-stats-count:eq(2)").text(data.following.length);  
            $(".profile-bio span").text(data.bio); 
        })
        .catch(function (error) {
            console.error(error);
        });
    }
});
