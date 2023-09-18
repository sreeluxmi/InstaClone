$(document).ready(function () {
    var access_token = localStorage.getItem('access_token');

    if (access_token) {
        fetch("/users/api/profile/me/", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                console.log("User is not authenticated.");
            } else {
                alert("An error occurred");
            }
        })
        .then(function (data) {
            $("#bio").val(data.bio);
        })

        $("#update-profile-form").submit(function (event) {
            event.preventDefault();
            
            const newData = {
                bio : document.getElementById('bio').value,
            };
            
            fetch("/users/api/profile/me/", {
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + access_token,
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(newData)
            })
            
            
            .then(response =>{
                console.log(response)
                if(response.ok){
                    window.location.href = "/users/api/profile/me/"
                    console.log("Profile updated")
                    return response.json()
                }else{
                    alert("Some error occured")
                }
            });

        });             
    }
});

        data.follow_requests.forEach(request => {
            const requestDiv = document.createElement('div');
            requestDiv.innerHTML = `
                <p>${request.follower.username}</p>
                <button class="accept-request" data-follower-id="${request.follower_id}">Accept</button>
                <button class="cancel-request" data-follower-id="${request.follower_id}">Cancel</button>
            `;
            followRequestContainer.append(requestDiv);
        });

        $('.accept-request').click(function () {
            const followerId = $(this).data('follower-id');
            handleFollowRequest('accept', followerId);
        });
 
        $('.cancel-request').click(function () {
            const followerId = $(this).data('follower-id');
            handleFollowRequest('cancel', followerId);
        });
            $("#follow-button").click(function(element){
               console.log(isPublic)
                const userToFollow = {
                    following_id: user_id
                };


       