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
            console.log(data)

            const isPublic = data.public;

            $("#follow-button").click(function(element){
               console.log(isPublic)
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
                    if (data.public) {
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
