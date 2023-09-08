$(document).ready(function(){
    $("#login-form").submit(function(event){
        event.preventDefault();

        var formData = {
        username :$("#username").val(),
        password :$("#password").val()
        }
        console.log(formData.username)
        console.log(formData.password)

        var csrfToken = $("input[name=csrfmiddlewaretoken]").val();
        $.ajax({
            type:"POST",
            url : "/users/loginAPI/",
            dataType: "json",
            data :formData,
            headers: {
                "X-CSRFToken":csrfToken
            },
            success: function(response){
                window.location.href = response.redirect_url;
                console.log(response)
                // // alert("Login successfull")
            },
            error: function(xhr){
                if (xhr.status === 401){
                    alert("Invalid credentials.Please try again");    
                } else{
                    alert("An error occurred")
                }
            }
        })
    })
})
