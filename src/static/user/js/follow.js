
fetch(`/users/api/profile/${user_id}/`, {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + access_token
    }
 }).then(function (response) {
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        console.log("User not authenticated");
    } else {
        alert("An error occurred");
    }
 }).then(data => {
    // Update profile information
 
    // Check if the user has pending follow requests
    if (data.follow_requests && data.follow_requests.length > 0) {
        // Display follow requests and buttons for accept/cancel
        const followRequestContainer = $('#follow-request-container');
        followRequestContainer.show();
        $('#follow-request-message').text('You have pending follow requests:');
 
        // Loop through follow requests
        data.follow_requests.forEach(request => {
            const requestDiv = document.createElement('div');
            requestDiv.innerHTML = `
                <p>${request.follower.username}</p>
                <button class="accept-request" data-follower-id="${request.follower_id}">Accept</button>
                <button class="cancel-request" data-follower-id="${request.follower_id}">Cancel</button>
            `;
            followRequestContainer.append(requestDiv);
        });
 
        // Add event listeners for accept and cancel buttons
        $('.accept-request').click(function () {
            const followerId = $(this).data('follower-id');
            handleFollowRequest('accept', followerId);
        });
 
        $('.cancel-request').click(function () {
            const followerId = $(this).data('follower-id');
            handleFollowRequest('cancel', followerId);
        });
    }
 
    // ... other profile data rendering code ...
 });
 // ...
 