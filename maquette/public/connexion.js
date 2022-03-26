document.addEventListener("DOMContentLoaded", async function () {
    
    //Vérifie si l'utilisateur est déjà connecté ou non
    if (localStorage.getItem("isConnected") !== null) {
        let cadre=document.getElementsByClassName("log")[0]
        cadre.innerHTML=""

        let errMsg=document.createElement("div")
        errMsg.classList.add("errMsg")
        errMsg.innerHTML="Vous êtes déjà connecté !"
        cadre.appendChild(errMsg)
        
        return
    }
    
    let form=document.getElementById("form")

    form.addEventListener("submit", async function(event){
        event.preventDefault()
        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData);    //Récuperer les valeurs du formulaire
    
        const params = {                //Paramètres à transmettre pour la requête GET
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
                if(response.err!==0){   //Si erreur, affichage d'un message d'erreur
                    document.getElementsByClassName("errMsg")[0].innerHTML=response.message
                }else{                  //Si connexion OK
                    localStorage.setItem("isConnected", "true");            //Ajout des éléments dans le localStorage pour identifier l'utilisateur actif
                    localStorage.setItem("userID", response.user._id)
                    localStorage.setItem("isAdmin", response.user.admin)
                    window.location.href = "..";        //Redirection sur la page d'accueil
                }
            });
        });
});
