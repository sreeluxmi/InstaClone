$(document).ready(function(){
    var access_token = localStorage.getItem('access_token')

    if (access_token){
        const searchInput = document.querySelector('.search')
        const followersList = document.getElementById('followersList')

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
            console.log(data)
            followersList.innerHTML='';
        
            if (data.followers && data.followers.length > 0){
                for(let i=0; i <data.followers.length; i++){
                    const item = data.followers[i]

                    const profileContainer = document.createElement("div");
                    profileContainer.style.height = "40px";
                    profileContainer.className = "user-profile";
                    
                    const nameLink = document.createElement('a');
                    nameLink.style.textDecoration = "none"
                    nameLink.style.color = "black"
                    nameLink.textContent = `${item.username}`;
                    nameLink.href = `/users/single-profile/${item.id}`; 
                    profileContainer.appendChild(nameLink);
                    
                    followersList.appendChild(profileContainer)
                }
            }
           
        })

    }
})