$(document).ready(function () {
    $("#login-form").submit(function (event) {
        event.preventDefault();

        var formData = {
            username: $("#username").val(),
            password: $("#password").val()
        };

        console.log(formData.username);
        console.log(formData.password);

        var csrfToken = $("input[name=csrfmiddlewaretoken]").val();

        fetch("/users/loginAPI/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify(formData)
        })
            .then(function (response) {
                if (response.status === 401) {
                    alert("Invalid credentials. Please try again");
                } else if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("An error occurred");
                }
            })
            .then(function (data) {
                var access_token = data.access_token;
                localStorage.setItem('access_token', access_token);
                window.location.href = data.redirect_url;
            })
    });
});

