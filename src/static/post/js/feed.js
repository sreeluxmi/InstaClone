document.addEventListener("DOMContentLoaded", function() {

    var access_token = localStorage.getItem('access_token')

    if(access_token){
        fetch('/apps.post/feedAPI',{
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + access_token,
            }
        }).then(function(response){
            if(response.ok){
                console.log("authenticated and feeds fetched")
                return response.json()
            }else if (response.status ===401){
                console.log("user is not authenticated")
            }else{
                console.log("An error occurred")
            }
        }).then(function(data){
                console.log(data)
                const feedContainer = document.getElementById("feed");
                feedContainer.innerHTML = "";

                if(data && data.length > 0){
                    for(let i=0; i<data.length; i++){
                        const item = data[i]
                        console.log(item)

                        const postContainer = document.createElement("div")
                        postContainer.className = 'post-container'

                        const nameContainer = document.createElement("p")
                        nameContainer.textContent = `Posted by ${item.username}`
                        postContainer.appendChild(nameContainer)

                        const imageList = document.createElement('ul')
                        for(let j=0; j< item.images.length; j++){
                            const imageItem = item.images[j]

                            const imageListItem = document.createElement("li");
                            imageListItem.className = "image-contained"
                            const image = document.createElement("img");
                            image.src = imageItem.image;
                            imageListItem.appendChild(image);

                            imageList.appendChild(imageListItem);
                        }

                        postContainer.appendChild(imageList);

                        const likesContainer = document.createElement("p")
                        likesContainer.textContent = `${item.likes.length} Likes`
                        postContainer.appendChild(likesContainer)

                        const caption = document.createElement('p')
                        caption.textContent = `${item.caption}`
                        postContainer.appendChild(caption)

                        feedContainer.appendChild(postContainer)

                    }
                }else{
                    console.log("No posts found")
                }


           })
    }else{
        window.location.href = '/users/home/';
    }

});
