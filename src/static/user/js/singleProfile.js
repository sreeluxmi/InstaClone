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