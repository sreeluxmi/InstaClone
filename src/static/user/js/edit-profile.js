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
                console.log("User authenticated.");
                return response.json();
            } else if (response.status === 401) {
                window.location.href = '/users/home/';
                console.log("User is not authenticated.");
            } else {
                window.location.href = '/users/home/';
            }
        })
        .then(function (data) {
            console.log(data)
            $("#bio").val(data.bio);

            const img = document.createElement("img")
            img.src = `${data.profile_pic}`
            const container = document.getElementById("image-container");
            console.log(img)
            container.appendChild(img);

            // const profilePicInput = document.getElementById('profile_pic');
            // profilePicInput.appendChild(img);
            // console.log(profilePicInput)

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
                if(response.ok){
                    window.location.href = "/users/me/"
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
