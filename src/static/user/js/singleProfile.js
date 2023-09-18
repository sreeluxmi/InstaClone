$(document).ready(function(){

    var access_token = localStorage.getItem('access_token')
    const user_id = $('#user_id').html()

    if (access_token){
        fetch(`/users/api/profile/${user_id}/`,{
            method: "GET",
            headers:{
                "Authorization": "Bearer " + access_token
            }
        }).then(function(response){
            if(response.ok){
                return response.json();
            }else if(response.status === 401){
                console.log("User not authenticated")
            }else{
                alert("An error occured")
            }
        }).then(data =>{
            $(".profile-name").text(data.username);
            $(".profile-followers-count").text(data.followers.length); 
            $(".profile-following-count").text(data.following.length);  
            $(".profile-bio span").text(data.bio);
            
            const img = document.createElement("img");
            img.src = data.profile_pic;
            const container = document.getElementById("profile-image");
            container.appendChild(img); 

            const isPublic = data.public;

            $('#cancel-request-button, #accept-request-button').click(function(){
                const buttonValue = $(this).text();
                const acceptRequest = {
                    "follower_id": user_id,
                    "action" : buttonValue
                }
                fetch("/users/accept_request/",{
                    method: "POST",
                    headers: {
                        "Authorization" : "Bearer " + access_token,
                        "Content-Type" : "application/json",
                    },
                    body : JSON.stringify(acceptRequest)
                })
                .then(function(response){
                    if (response.ok){
                        if (buttonValue == "accept"){
                            console.log("Request accepted")
                        }else{
                            console.log("Request canceled")
                        }
                    }else{
                        alert("Invalid")
                    }
                })
            });

            console.log(data.follow_requests)


            $("#follow-button").click(function(){
                const userToFollow = {
                    following_id: user_id
                };
                fetch("/users/follow_request/", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + access_token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userToFollow)
                })
                .then(function (response) {
                if (response.ok) {
                    console.log(data.follow_requests)
                    if (isPublic) {
                        $("#follow-button").text("Following");
                    } else {
                        $("#follow-button").text("Requested");
                    }
                } else {
                    alert("Error sending follow request.");
                }
                })
            })              
        })


    }
});
