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
            console.log(data)

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



        })


    }
});
