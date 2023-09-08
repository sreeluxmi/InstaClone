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
            url : "/login/",
            dataType: "json",
            data :formData,
            headers: {
                "X-CSRFToken":csrfToken
            },
            success: function(response){
                alert("Login successfull")
            },
            error: function(xhr, textStatus, errorThrown){
                if (xhr.status === 401){
                    alert("Invalid credentials.Please try again");    
                } else{
                    alert("An error occurred")
                }
            }
        })
    })
})
