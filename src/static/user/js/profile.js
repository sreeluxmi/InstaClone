$(document).ready(function () {
    var access_token = localStorage.getItem('access_token');

    if (access_token) {
        fetch("/users/api/profile/me/", {
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
                window.location.href = '/users/home/';
            }
        })
        .then(function (data) {
            console.log(data)
            $(".profile-name").text(data.username); 
            $(".profile-followers-count").text(data.followers.length); 
            $(".profile-following-count").text(data.following.length);  
            $(".profile-bio span").text(data.bio);

            const img = document.createElement("img");
            img.src = data.profile_pic;

            const container = document.getElementById("profile-image");
            container.appendChild(img);

            postsList.innerHTML = ''

            if( data.posts.length > 0){
                for(let i=0; i<data.posts.length;i++){
                    const item=data.posts[i]

                    const postContainer = document.createElement("div")
                    postContainer.className = 'post-container'
                    console.log(item)

                    const delButton = document.createElement('button')
                    delButton.textContent = "Delete post"
                    delButton.className = 'delButton';



                    delButton.addEventListener('click', function(){
                        fetch(`/users/api/posts/${item.images[0].post}`,{
                            method: "DELETE",
                            headers: {
                                "Authorization" : "Bearer " + access_token,
                            },                           
                        })
                        .then(function(response){
                            if (response.ok) {
                                console.log("post deleted")
                            } else {
                                console.log("bad request")
                            }
                        })
                    })
                    postContainer.appendChild(delButton)

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


        })             
    }else{
        window.location.href = '/users/home/';
    }
});
