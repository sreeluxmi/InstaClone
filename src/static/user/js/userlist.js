$(document).ready(function(){
    var access_token = localStorage.getItem('access_token');

    if (access_token) {
        const searchInput = document.querySelector('.search');
        const userListContainer = document.getElementById('userList');

 
        function fetchAndDisplayUsers() {
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
                console.log(data);

                userListContainer.innerHTML = '';

                if (data && data.length > 0) { 
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        const li = document.createElement("li");
                        li.textContent = `${item.username}`;
                        userListContainer.appendChild(li);
                    }
                }
            });
        }


        fetchAndDisplayUsers();

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

                userListContainer.innerHTML = ''; 

                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        const li = document.createElement("li");
                        li.textContent = `${item.username}`;
                        userListContainer.appendChild(li);
                    }
                }
            });
        });
    }
});







