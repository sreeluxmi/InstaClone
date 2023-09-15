$(document).ready(function(){
    var access_token = localStorage.getItem('access_token');

    if (access_token) {
        const searchInput = document.querySelector('.search');
        const userList = document.getElementById('userList');

        fetch("/users/api/profile/", {
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
            // console.log(data);
            userList.innerHTML = '';

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


                    const img = document.createElement("img")
                    img.src = `${item.profile_pic}`
                    profileContainer.appendChild(img);

                    userList.appendChild(profileContainer);
                    // const item = data[i];
                    // console.log("item", item)
                    // const li = document.createElement("li");
                    // console.log("li",li)
                    // li.textContent = `${item.username}`;
                    // console.log("li.textContent", li.textContent)
                    // userList.appendChild(li);

                    // const img = document.createElement("img")
                    // console.log("img", img)
                    // img.src = `${item.profile_pic}`
                    // console.log("img.src", img.src)
                    // const container = document.getElementById("userList");
                    // console.log("container", container)
                    // container.appendChild(img)


                }
            }
        });



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

                userList.innerHTML = ''; 

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


                    const img = document.createElement("img")
                    img.src = `${item.profile_pic}`
                    profileContainer.appendChild(img);

                    userList.appendChild(profileContainer);
                    }
                }
            });
        });
    }
});







