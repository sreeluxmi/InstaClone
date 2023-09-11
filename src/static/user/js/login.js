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
                var access_token = response.access_token;
                localStorage.setItem('access_token', access_token)
                window.location.href = response.redirect_url;
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
