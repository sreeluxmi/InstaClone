$(document).ready(function(){
    var access_token = localStorage.getItem('access_token')
    const user_id = $('#user_id').html()
    console.log(user_id)
    if (access_token){
        fetch(`/users/api/profile/${user_id}/`,{
            method: "GET",
            headers:{
                "Authorization": "Bearer" + access_token
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
            console.log(data)
            $(".profile-name").text(data.username); 
            $(".profile-followers-count").text(data.followers.length); 
            $(".profile-following-count").text(data.following.length);  
            $(".profile-bio span").text(data.bio);
            
            const img = document.createElement("img");
            img.src = data.profile_pic;
            const container = document.getElementById("profile-image");
            container.appendChild(img);         
        })
    }
});



$(document).ready(function(){
    var access_token = localStorage.getItem('access_token')
    const user_id = $('#user_id').html()
    console.log(user_id)
    if (access_token){
        // ...

        // Add an event listener to the "Follow" button
        $("#follow-button").click(function () {
            sendFollowRequest(user_id);
        });
    }
});


function sendFollowRequest(user_id) {
    var access_token = localStorage.getItem('access_token');
    if (access_token) {
        // Prepare the request body
        const data = {
            following_id: user_id
        };

        // Send a POST request to the follow_request endpoint
        fetch("/follow_request/", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + access_token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(function (response) {
            if (response.ok) {
                // Follow request successful
                // You can update the button or provide feedback to the user
                $("#follow-button").text("Following");
            } else {
                // Handle errors or show an alert to the user
                alert("Error sending follow request.");
            }
        })
        .catch(function (error) {
            console.error("Error sending follow request:", error);
        });
    }
}


function sendFollowRequest(user_id) {
    var access_token = localStorage.getItem('access_token');
    if (access_token) {
        // Prepare the request body
        const data = {
            following_id: user_id
        };

        // Send a POST request to the follow_request endpoint
        fetch("/follow_request/", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + access_token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(function (response) {
            if (response.ok) {
                // Follow request successful
                // Check if the account is public or private
                fetch(`/users/api/profile/${user_id}/`, {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + access_token
                    }
                })
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else if (response.status === 401) {
                        console.log("User not authenticated");
                    } else {
                        alert("An error occurred");
                    }
                })
                .then(function (data) {
                    if (data.public) {
                        $("#follow-button").text("Following");
                    } else {
                        $("#follow-button").text("Requested");
                    }
                })
                .catch(function (error) {
                    console.error("Error checking account type:", error);
                });
            } else {
                // Handle errors or show an alert to the user
                alert("Error sending follow request.");
            }
        })
        .catch(function (error) {
            console.error("Error sending follow request:", error);
        });
    }
}
