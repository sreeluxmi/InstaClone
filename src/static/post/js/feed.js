document.addEventListener("DOMContentLoaded", function() {

    var access_token = localStorage.getItem('access_token')

    if(access_token){
        fetch('/users/feedAPI',{
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

                if(data.length > 0){
                    console.log(data.length)
                    for(let i=0; i<data.length; i++){
                        const item = data[i]
                        console.log(item)

                        const postContainer = document.createElement("div")
                        postContainer.className = 'post-container'

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
