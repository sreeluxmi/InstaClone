$(document).ready(function () {
    $("#registerForm").submit(function (event) {
        event.preventDefault();

        var formData = {
            username: $("#username").val(),
            email: $("#email").val(),
            password: $("#password").val()
        };

        console.log(formData.username);
        console.log(formData.email);
        console.log(formData.password);

        fetch("/users/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then(function (response) {
                if (response.ok) {
                    window.location.href = '/users/home/';
                } else if (response.status === 400) {
                    console.log("A user with that username already exists.");
                } else {
                    throw new Error("An error occurred");
                }
            })
    });
});



