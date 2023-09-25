$(document).ready(function(){

    var access_token = localStorage.getItem('access_token')
    const user_id = $('#user_id').html()


    //single profile view
    if (access_token){
        fetch(`/users/api/profile/${user_id}/`,{
            method: "GET",
            headers:{
                "Authorization": "Bearer " + access_token
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

            const isPublic = data.public;

            if( data.posts.length > 0){
                for(let i=0; i<data.posts.length;i++){
                    const item=data.posts[i]

                    const postContainer = document.createElement("div")
                    postContainer.className = 'post-container'
                    console.log(item)


                    const imageList = document.createElement("ul");

                    for (let j = 0; j < item.images.length; j++) {
                        const imageItem = item.images[j];
        
                        const imageListItem = document.createElement("li");
                        const image = document.createElement("img");
                        image.src = imageItem.image;
                        imageListItem.appendChild(image);
        
                        imageList.appendChild(imageListItem);
                    }
        
                    postContainer.appendChild(imageList);

                    const caption = document.createElement('p')
                    caption.textContent = `${item.caption}`
                    postContainer.appendChild(caption)


                    postsList.appendChild(postContainer)
                }
            }


            // accept request container view
            if(data.accept_requests.length>0 && data.accept_requests[0].reqstatus === 'pending'){
                $("#follow-request-message").text(`You have a follow request from ${data.username}`);
            }else{
                $("#follow-request-container").hide();
            }

            // accept request accept or cancel action
            $('#cancel-request-button, #accept-request-button').click(function(){
                const buttonValue = $(this).text();
                console.log(buttonValue)
                const acceptRequest = {
                    "follower_id": user_id,
                    "action" : buttonValue
                }
                fetch("/users/accept_request/",{
                    method: "POST",
                    headers: {
                        "Authorization" : "Bearer " + access_token,
                        "Content-Type" : "application/json",
                    },
                    body : JSON.stringify(acceptRequest)
                })
                .then(function(response){
                    if (response.ok) {
                        if (buttonValue == "accept" && buttonValue == "Accept"){
                            $("#follow-request-container").hide();
                        } else{
                            $("#follow-request-container").hide();
                        }
                    } else {
                        alert("Invalid");
                    }
                })
            })
            

            //sending follow request, unfollowing and request canceling
            $("#follow-button").click(function(){

                if ($(this).text()==="Follow"){
                    const userToFollow = {
                        following_id: user_id
                    };
                    fetch("/users/follow_request/", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + access_token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userToFollow)
                    })
                    .then(function (response){
                        if (response.ok) {
                            if (isPublic) {
                                $("#follow-button").text("Following");
                            } else {
                                $("#follow-button").text("Requested");
                            }
                        } else {
                            console.log("Already following error")
                        }
                    })
                }else if($(this).text()==="Following" ) {
                    fetch(`/users/unfollow/${user_id}`, {
                        method : "DELETE",
                        headers : {
                            "Authorization": "Bearer " + access_token,
                            "Content-Type" : "application/json"
                        }
                    })
                    .then(function(response){
                        if(response.ok){
                            $('#follow-button').text("Follow");
                            console.log("Unfollowed :(")
                        }else{
                            console.log("canceling failed")
                        }
                    })
                }else if($(this).text()==="Requested" ){
                    const reqToCancel = {
                        following_id: user_id,
                        "action" : "cancel"
                    };
                    fetch("/users/follow_request/", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + access_token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(reqToCancel)
                    })
                    .then(function (response){
                        if (response.ok) {
                            $("#follow-button").text("Follow");
                        } else {
                            console.log("Already Request cancelling error")
                        }
                    })
                }


            })

            if(data.follow_requests.length>0 && data.follow_requests[0].reqstatus === 'accepted'){
                $("#follow-button").text("Following")
            }else if(data.follow_requests.length>0 && data.follow_requests[0].reqstatus === 'pending'){
                $("#follow-button").text("Requested")
            }

        })

    }else{
        window.location.href = '/users/home/';
    }
});
