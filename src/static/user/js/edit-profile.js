$(document).ready(function () {
    var access_token = localStorage.getItem('access_token');
    var userData;

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
            console.log(data)

            userData = data;

            $("#bio").val(data.bio);
        })

        $("#update-profile-form").submit(function (event) {
            event.preventDefault();
            
            const dataToUpdate = {
                bio : document.getElementById('bio').value,
            };
            console.log(userData)
            
            fetch(`/users/api/profile/`, {
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + access_token,
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(dataToUpdate)
            })
            .then(function (response) {
                console.log(response)
                if (response.ok) {
                    console.log("Profile updated")
                    window.location.href = '/users/me/'
                    // return response.json();
                } else {
                    alert("An error occurred while updating the profile.");
                }
            })
        });             
    }
});