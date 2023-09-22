$(document).ready(function(){
    $("#imagePostingForm").submit(function(event){
        event.preventDefault();


        var access_token = localStorage.getItem('access_token');

        if(access_token){
            const inpfile = document.getElementById('images')
            
            const formData = new FormData();

            console.log(inpfile.files)

            for (const file of inpfile.files){
                formData.append('images', file);
            }
            formData.append('caption', $("#caption").val());
            
            // const formData ={
            //     caption : $("#caption").val(),
            //     uploaded_images : file
            // }

            // console.log(formData.caption)
            // console.log(formData.uploaded_images)
            // console.log(formData)


            // formData.append('caption', $("#caption").val());
            // formData.append('uploaded_images', file);


            fetch('/users/api/posts/',{
                method: "POST",
                headers:{
                    "Authorization": "Bearer " + access_token,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            }).then(function(response){
                if(response.ok){
                    console.log("Upload successfull")
                }else{
                    console.log(response)
                    console.log("Something went wrong")
                }
            })
        }else{
            window.location.href = '/users/home/';        
        }        
    })


})
