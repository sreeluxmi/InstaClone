$(document).ready(function(){
    var access_token = localStorage.getItem('access_token');

    if(access_token){
        fetch("/users/api/profile/",{
            method:"GET",
            headers:{
                "Authorization": "Bearer" +access_token
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

                const ul = document.getElementById('userList')

                for (let i=0; i <data.length; i++){
                    const item = data[i];
                    const li = document.createElement("li")
                    li.innerHTML = `${item.username}`
                    ul.appendChild(li)
                }
            })
    }
});
