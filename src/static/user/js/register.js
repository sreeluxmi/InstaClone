$(document).ready(function(){
    $("#registerForm").submit(function(event){
        event.preventDefault();

        var formData = {
            username :$("#username").val(),
            email : $("#email").val(),
            password : $("#password").val()
        }
        console.log(formData.username)
        console.log(formData.email)
        console.log(formData.password)

        $.ajax({
            type:"POST",
            url : "/users/register/",
            dataType: "json",
            data:formData,
            success: function(response){
                window.location.href = '/users/home/'
                // console.log("Register successfull")
            },
            error: function(response){
                if (response.status === 400){
                    console.log("A user with that username already exists.")
                } else{
                    console.log("An error occurred")
                }
            }
        })
    })
})