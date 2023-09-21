$(document).ready(function(){

    var access_token = localStorage.getItem('access_token')


    //single profile view
    if (access_token){
        fetch("/users/api/profile/me/",{
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
            console.log(data.pending_requests)

            if (data.pending_requests && data.pending_requests.length > 0){
                for (let i=0; i<data.pending_requests.length ; i++){
                    const item = data.pending_requests[i]

                    const user_id = item.follower

                    fetch(`/users/api/profile/${user_id}`,{
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
                        console.log(data.username)
                        $("#follow-request-message").text(`You have a follow request from ${data.username}`);
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
                                    $("#followRequestContainer").hide();
                                } else{
                                    $("#followRequestContainer").hide();
                                }
                            } else {
                                alert("Invalid");
                            }
                        })
                        })
                    })

                }
            }else{
                $("#followRequestContainer").text("You have no pending request"); 
            }
        })

    }
});
