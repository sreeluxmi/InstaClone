$(document).ready(function(){
    var access_token = localStorage.getItem('access_token')

    if (access_token){
        const searchInput = document.querySelector('.search')
        const followingList = document.getElementById('followingList')

        fetch("/users/api/profile/me/", {
            method: "GET",
            headers: {
                "Authorization" : "Bearer " + access_token
            }
        }).then(function(response){
            if (response.ok){
                return response.json();
            }else if (response.status ===401){
                console.log("user is not authenticated")
            }else{
                console.log("An error occurred")
            }
        }).then(data=>{

            console.log("following", data.following)
            followingList.innerHTML='';  

            if (data.following && data.following.length > 0){
                for(let i=0; i <data.following.length; i++){
                    const item = data.following[i]
                    console.log(data.following[i].id)

                    const profileContainer = document.createElement("div");
                    profileContainer.style.height = "40px";
                    profileContainer.className = "user-profile";
                    
                    const nameLink = document.createElement('a');
                    nameLink.style.textDecoration = "none"
                    nameLink.style.color = "black"
                    nameLink.textContent = `${item.username}`;
                    console.log(`${item.username}`)
                    nameLink.href = `/users/single-profile/${item.id}`; 
                    profileContainer.appendChild(nameLink);
                    
                    followingList.appendChild(profileContainer)
                }
            }            
        })

        document.querySelector('form').addEventListener('submit', function (e) {
            e.preventDefault();
            const searchQuery = searchInput.value.trim();
            console.log(searchInput)

            fetch(`/users/api/profile/?search=${searchQuery}`, {
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
                console.log(data);

                followingList.innerHTML = ''; 

                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                    const item = data[i]

                    const profileContainer = document.createElement("div");
                    profileContainer.style.height = "60px";
                    profileContainer.className = "user-profile";

                    const nameLink = document.createElement('a');
                    nameLink.style.textDecoration = "none"
                    nameLink.style.color = "black"
                    nameLink.textContent = `${item.username}`;
                    nameLink.href = `/users/single-profile/${item.user}`; 
                    profileContainer.appendChild(nameLink);


                    followingList.appendChild(profileContainer);
                    }
                }
            });
        }); 
    }else{
        window.location.href = '/users/home/';
    }
})