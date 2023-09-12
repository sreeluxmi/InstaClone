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
                alert("An error occurred");
            }
        })
        .then(function (data) {
            console.log("data", data);
            $(".profile-name").text(data.username); 
            $(".profile-followers-count").text(data.followers.length); 
            $(".profile-following-count").text(data.following.length);  
            $(".profile-bio span").text(data.bio);

            console.log(data.profile_pic);
            const img = document.createElement("img");
            img.src = data.profile_pic;
            const container = document.getElementById("profile-image");
            container.appendChild(img);

            $("#update-profile-form").submit(function (event) {
                event.preventDefault();

                var formData = new FormData(this);
                // formData.append("csrfmiddlewaretoken", csrfToken); 

                fetch("/users/api/profile/me/", {
                    method: "PUT",
                    headers: {
                        "Authorization": "Bearer " + access_token
                    },
                    body: formData
                })
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        alert("An error occurred while updating the profile.");
                    }
                })
                .then(function (updatedData) {
                    $(".profile-name").text(updatedData.username);
                    $(".profile-bio span").text(updatedData.bio);
                    alert("Profile updated successfully!"); 
                });
            });            
        })
    }

});




