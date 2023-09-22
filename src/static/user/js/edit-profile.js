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
            console.log(data)
            $("#bio").val(data.bio);

        })

        $("#update-profile-form").submit(function (event) {
            event.preventDefault();
            
            const newData = {
                bio : document.getElementById('bio').value
            };
            console.log(bio)

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
    }else{
        window.location.href = '/users/home/';
    }
});
