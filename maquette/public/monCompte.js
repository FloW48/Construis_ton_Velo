document.addEventListener("DOMContentLoaded", async function () {

    //Vérifie si l'utilisateur est connecté ou non
    if (localStorage.getItem("isConnected") === null) {
        let cadre=document.getElementsByClassName("log")[0]
        cadre.innerHTML=""

        let errMsg=document.createElement("div")
        errMsg.classList.add("errMsg")
        errMsg.innerHTML="Vous n'êtes pas connecté! <h1>Cliquez <a href=\"connexion.html\">ici</a> pour vous connecter</h1>"
        cadre.appendChild(errMsg)
        
        return
    }

    var fetch_url="/api/utilisateur/showUtilisateur?userID="+localStorage.getItem("userID")     //Récupération des informations de l'utilisateur

    var infosFetch= await fetch(fetch_url);
    var data = await infosFetch.json();
    let infosUser=data['response']

    //Rempli les informations de l'utilisateur, sauf le mot de passe (si l'utilisateur ne veut pas modifier son mot de passe, alors il doit laisser le champ vide)
    document.getElementById('nom').value=infosUser.nom
    document.getElementById('firstname').value=infosUser.firstname
    document.getElementById('lastname').value=infosUser.lastname
    document.getElementById('ville').value=infosUser.ville
    
    if(infosUser.codepostal!=-1){
        document.getElementById('codepostal').value=infosUser.codepostal
    }
    
    document.getElementById('rue').value=infosUser.rue
    document.getElementById('email').value=infosUser.email

    if(infosUser.tel!=-1){
        document.getElementById('tel').value=infosUser.tel
    }

    let form=document.getElementById("form")

    form.addEventListener("submit", async function(event){
        event.preventDefault()
        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData);    //Récuperer les valeurs du formulaire
    
        const params = {            //Paramètres à transmettre pour la requête POST
            userID: localStorage.getItem("userID"),
            nom: formValues.nom,
            password: formValues.password,
            firstname:formValues.firstname,
            lastname:formValues.lastname,
            email:formValues.email, 
            tel:formValues.tel,
            ville:formValues.ville,
            codepostal:formValues.codepostal,
            rue:formValues.rue,
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify( params )  
        };

        await fetch( '/api/utilisateur/updateUtilisateur', options )
            .then( response => response.json() )
            .then( response => {
                console.log(response)
                let msgErreur=document.getElementsByClassName("errMsg")[0]

                if(response.err==0){    //Si il n'y a pas d'erreur, alors le message est en vert
                    msgErreur.style.color = 'green';
                }
                msgErreur.innerHTML=response.message
                setTimeout(function() {
                    msgErreur.style.color = 'red';
                    msgErreur.innerHTML = ""
                }, 3000)
            } );
        });

})
