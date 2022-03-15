
document.addEventListener("DOMContentLoaded", async function () {
    
    
    let form=document.getElementById("form")


    form.addEventListener("submit", async function(event){
        event.preventDefault()
        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData);    //Récuperer les valeurs du formulaire
    
        const params = {
            name: formValues.nom,
            password: formValues.password 
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify( params )  
        };

        await fetch( '/api/utilisateur/loginUtilisateur', options )
            .then( response => response.json() )
            .then( response => {
                console.log(response)
                if(response.err==1){
                    document.getElementsByClassName("errMsg")[0].innerHTML=response.message
                }else{
                    if(response.err==2){
                        document.getElementsByClassName("errMsg")[0].innerHTML=response.message
                    }else{
                        localStorage.setItem("isConnected", "true");
                        localStorage.setItem("userID", response.user._id)
                        localStorage.setItem("userNom", response.user.nom)
                        window.location.href = "..";
                    }
                }
                

            } );
            



        });
});
