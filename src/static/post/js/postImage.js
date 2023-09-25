document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("imagePostingForm").addEventListener("submit", function (event) {
        event.preventDefault()
        var access_token = localStorage.getItem('access_token')

        if (access_token){
            const imageInput = document.getElementById("images");
            console.log(imageInput)
            const captionInput = document.getElementById("caption");
    
            const formData = new FormData();
            const images = imageInput.files;
    
            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    formData.append("uploaded_images", images[i]);
                }
            } else {
                formData.append("uploaded_images", imageInput.files[0]);
            }
            
    
            formData.append("caption", captionInput.value);
    
            fetch("/users/api/posts/", {
                method: "POST",
                headers: {
                    "Authorization" : "Bearer " + access_token
                },
                body: formData,
            })
            .then(function (response){
                if (response.ok){
                    console.log("success")
                }else{
                    console.log("Error")
                }
            })
        }else{
            window.location.href = '/users/home/';
        }

    });
});
