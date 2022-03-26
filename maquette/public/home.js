var pieces_selectionnees=new Array(5)   //Contient les informations des pièces actuellement sélectionnées par l'utilisateur
var prixTotal=0                         //Prix total des pièces


/**
 * Met à jour l'affichage du prix total
 * @return {double} prixTotal - Le prix total des pièces sélectionnées
 */
function updatePrice(){
    let total=0;
    pieces_selectionnees.forEach(function (element){
        if(element!=undefined){
            if(element.id_partie==2){   //Cas du pneu: Lot de 2 donc prix * 2 
                total+=element.prix*2;
            }else{
                total+=element.prix;
            }
        }
    })
    let prixTotal= Math.round(total * 100) / 100;

    let prixTotalDisplay=document.getElementById("prixTotal")
    prixTotalDisplay.innerHTML="Prix total: "+prixTotal+"€"

    return prixTotal
}

/**
 * Indique si toutes les différentes pièces sont sélectionnées
 * @return {boolean} Vrai si toutes les différentes pièces sont sélectionnées, faux sinon
 */
function isVeloComplet(){    
    for(let i=0;i<pieces_selectionnees.length;i++){
        if(pieces_selectionnees[i]==null){
            return false
        }
    }
    return true
}

document.addEventListener("DOMContentLoaded", async function () {
    let socket = io.connect();
    
    //Vérification connexion utilisateur, et cache les éléments qui ne sont pas utiles selon cette condition
    if (localStorage.getItem("isConnected") !== null) {
        document.getElementById("btnLogIn").remove()
        document.getElementById("btnRegister").remove()
        if(localStorage.getItem("isAdmin") === "false"){
            document.getElementById("buttonScrapping").remove()
        }
    }else{
        document.getElementById("btnLogOut").remove()
        document.getElementById("btnMesVelos").remove()
        document.getElementById("btnMonCompte").remove()
        document.getElementById("buttonScrapping").remove()
        document.getElementsByClassName("bottom")[1].innerHTML="Veuillez vous <a href=\"./connexion.html\">connecter</a> ou <a href=\"./enregistrement.html\">créer un compte</a> pour pouvoir sauvegarder ce vélo" //Message en bas du cadre du vélo affiché
    }

    //Cache le bouton 'Site source' en cas d'un clique autre part sur la page
    document.body.addEventListener("click",function(){
        let infoSite=document.getElementById("infoSite")
        if(typeof(infoSite) != 'undefined' && infoSite != null){
            infoSite.remove()
        }
    })

    //Charge les données du local storage
    function load(){
        if(JSON.parse(localStorage.getItem("savePieces"))!=null){
            pieces_selectionnees=JSON.parse(localStorage.getItem("savePieces"));
            for (let i=1;i<=5;i++){
                if(pieces_selectionnees[i-1]!=undefined){
                    showCurrentPiece(i)
                }
                
            }
            displayImages()
        }
    }

    load()
    updatePrice()

    var popupPiece = document.getElementById("popupPiece");
    var closePopup = document.getElementById("closePopup");
    var elements_showPieces = document.getElementsByClassName("showPiece");


    /**
     * Affiche le vélo en bas de la page en affichant les images de chaque parties du vélo
    */
    async function displayImages(){
        let emptyPNGbase64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg==" //Image vide pour représenter les pièces non selectionnées

        /*Pour chaque pièces, vérification si elle est sélectionnée.
            Si oui: demande au serveur la valeur en base 64 de l'image, puis affichage de cette image
            Si non: Utilisation de l'image vide
        */
        if(pieces_selectionnees[0]!=undefined){
            socket.emit("askImgBase64",pieces_selectionnees[0].image,function(imageBase64){                
                displayImageContouring("cadre",imageBase64)
            })
        }else{
            displayImageContouring("cadre",emptyPNGbase64)
        }
        
        if(pieces_selectionnees[1]!=undefined){
            socket.emit("askImgBase64",pieces_selectionnees[1].image,function(imageBase64){                
                displayImageContouring("roueG",imageBase64)
                displayImageContouring("roueD",imageBase64)
            })
        }else{
            displayImageContouring("roueG",emptyPNGbase64)
            displayImageContouring("roueD",emptyPNGbase64)
        }
        
        
        if(pieces_selectionnees[2]!=undefined){
            socket.emit("askImgBase64",pieces_selectionnees[2].image,function(imageBase64){
                displayImageContouring("guidon",imageBase64)
            })        
        }else{
            displayImageContouring("guidon",emptyPNGbase64)
        }

        if(pieces_selectionnees[3]!=undefined){
            socket.emit("askImgBase64",pieces_selectionnees[3].image,function(imageBase64){
                displayImageContouring("plateau",imageBase64)
            })
        }else{
            displayImageContouring("plateau",emptyPNGbase64)
        }
        
        if(pieces_selectionnees[4]!=undefined){
            socket.emit("askImgBase64",pieces_selectionnees[4].image,function(imageBase64){ 
                displayImageContouring("selle",imageBase64)
            })        
        }else{
            displayImageContouring("selle",emptyPNGbase64)
        }

    }

    /**
     * Affichage d'une pièce dans le cadre de l'affichage du vélo, en faisant un traitement pour retirer son fond blanc
     * @param {string} nom_piece - Nom de la partie représentée (ex: "cadre", "guidon" etc..)
     * @param {string} base64 - Valeur base64 de l'image à afficher
    */
    function displayImageContouring(nom_piece,base64){
        var canvas = document.getElementById(nom_piece);
        canvas.height=200;
        canvas.width=200;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var img = new Image();   
        img.src = base64
        img.onload = function(){
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height),
            pix = imgd.data,
            newColor = {r:150,g:150,b:120, a:0}; //Nouvelle valeur des pixels
            for (var i = 0, n = pix.length; i <n; i += 4) {
                var r = pix[i],
                        g = pix[i+1],
                        b = pix[i+2];
            
                    if( (r <= 255 && r > 200)           //Vérifie si le pixel actuel est dans les tons blancs
                        && (g <= 255 && g > 200)
                        && (b <= 255 && b > 200)){ 
                        // Modification du pixel en utilisant les nouvelles valeurs
                        pix[i] = newColor.r;
                        pix[i+1] = newColor.g;
                        pix[i+2] = newColor.b;
                        pix[i+3] = newColor.a;
                    }
            }
            ctx.putImageData(imgd, 0, 0);
        }
    }
    
    /**
     * Affiche toutes les pièces correspondantes à un id (id défini dans un attribut data-idpiece lors du clique sur l'élément dans la page HTML) dans une fenêtre 'popup'
    */
    async function function_showPieces () {
        var idpiece = this.getAttribute("data-idpiece");
        var popupcontent=document.getElementsByClassName("popup-content")[0];
        popupcontent.innerHTML=""   //Réinitialise le contenu du popup
        
        var nom_piece="";
        
        popupPiece.style.display = "block";

        var fetch_url="/api/equipement/showPieces?pieceID="+idpiece

        //Récupération du nom de la partie du vélo selon son id
        switch(idpiece){
            case "1":
                nom_piece="cadres"
                break
            case "2":
                nom_piece="pneus"
                break
            case "3":
                nom_piece="guidons"
                break
            case "4":
                nom_piece="plateaux"
                break
            case "5":
                nom_piece="selles"
                break
            default:
                nom_piece="{pièce_inconnue}"
        }

        let titrePopup=document.createElement("h2");
        titrePopup.textContent="Liste des " + nom_piece + " disponibles :"
        popupcontent.appendChild(titrePopup)

        var pieces= await fetch(fetch_url);
        var data = await pieces.json();

        console.log(data)

        data['response'].forEach(function(element){ 
            let piecePopup = document.createElement("div");
            piecePopup.className="piecePopup";

            var data_idarticle = document.createAttribute("data-idarticle");
            data_idarticle.value = element._id;
            piecePopup.setAttributeNode(data_idarticle);

            piecePopup.addEventListener("click", async function () {
                var piece = {
                    _id: element._id,
                    id_partie: element.id_partie,
                    nom: element.nom,
                    prix: element.prix,
                    lien: element.lien,
                    image: element.image,
                    carbone: element.carbone,
                };

                pieces_selectionnees[idpiece-1]=piece; //Sauvegarde l'article en tant que l'article choisi

                showCurrentPiece(idpiece);

                displayImages() //Met à jour le vélo affiché
                updatePrice()
                localStorage.setItem("savePieces", JSON.stringify(pieces_selectionnees));
            });

            showInfosPiece(piecePopup,element)

            document.getElementsByClassName("popup-content")[0].appendChild(piecePopup)
        })
    };

    for (var i = 0; i < elements_showPieces.length; i++) {
        elements_showPieces[i].addEventListener('click', function_showPieces, false);
    }
    
    //Gère la fermeture de la fenêtre popup
    closePopup.onclick = function() {
        document.getElementsByClassName("popup-content")[0].innerHTML="";
        popupPiece.style.display = "none";
    }

    /**
     * Créé un élément qui présente les informations d'une pièce: son nom, son prix, son image et son lien source
     * @param {string} parentElement - Élément HTML étant le conteneur de l'élément crée
     * @param {array} infosPiece - Tableau contenant les diverses information de la pièce
    */
    function showInfosPiece(parentElement,infosPiece){
        //NOM PIECE
        let nom_article=document.createElement("h1");
        nom_article.textContent=infosPiece.nom;
        parentElement.appendChild(nom_article);
        
        //IMAGE
        let img=document.createElement("img")
        img.src=infosPiece.image             //Lien de l'image
        parentElement.appendChild(img)

        let table=document.createElement("table");
        
        //PRIX
        let trPrice=document.createElement('tr');

        let priceValue=document.createElement('td');
        priceValue.textContent=infosPiece.prix+'\u20AC';
        trPrice.appendChild(priceValue);

        table.appendChild(trPrice);

        //SITE SOURCE
        let trSite=document.createElement('tr');

        let siteValue=document.createElement('td');
        let btnInfoSite=document.createElement('button')
        btnInfoSite.innerHTML="🛈"
        btnInfoSite.addEventListener("click", function(e){
            
            let infoSite=document.getElementById("infoSite")
            if(typeof(infoSite) != 'undefined' && infoSite != null){
                infoSite.remove()
            }

            e.stopPropagation()
            
            infoSite=document.createElement("div")
            infoSite.setAttribute("id","infoSite")
            infoSite.innerHTML="<a href=\""+infosPiece.lien+"\" target=\"_blank\">Site source</a>"
            
            infoSite.addEventListener("click", function(e){ //Empêche d'ouvrir la sélection de pièce lors du clique sur le lien source
                e.stopPropagation()         
            })

            e.target.parentNode.appendChild(infoSite)
        })
        siteValue.appendChild(btnInfoSite)

        trSite.appendChild(siteValue);

        table.appendChild(trSite)

        parentElement.appendChild(table)
    }


    /**
     * Affichage de la pièce actuellement sélectionnée, sur la page d'accueil, selon son identifiant de partie
     * @param {string} idpiece - Identifiant de la partie du vélo
    */
    function showCurrentPiece(idpiece){
        let pieceSelected = document.getElementsByClassName("showPiece")[idpiece-1].firstElementChild;
        pieceSelected.textContent="";
        showInfosPiece(pieceSelected,pieces_selectionnees[idpiece-1])
    }

    //Boutons pour supprimer une pièce sélectionnée
    let delPieces=document.getElementsByClassName("delPiece")
    for (var i = 0; i < 5; i++) {
        delPieces[i].addEventListener('click', function(){
            idpiece=this.getAttribute("data-idpiece")
            let showPiece=document.getElementsByClassName("showPiece")[idpiece-1]
            showPiece.innerHTML="<div class=\"pieceSelected\"><h1>Sélectionner une pièce</h1></div>"

            pieces_selectionnees[idpiece-1]=undefined;

            displayImages() //Met à jour l'affichage du vélo
            updatePrice()

            localStorage.setItem("savePieces", JSON.stringify(pieces_selectionnees));

        });
    }

    //Bouton pour choisir automatiquement les pièces les moins chères possibles
    let optPrix = document.getElementById("optPrix");
    optPrix.onclick = async function(){
        var fetch_url;
        var pieceMinPrice;
        var data;

        for(let i=1;i<6;i++){
            fetch_url="/api/equipement/findMinPrice?pieceID="+i
            pieceMinPrice= await fetch(fetch_url);
            data = await pieceMinPrice.json();

            var piece = {
                _id: data['response'][0]._id,
                id_partie: data['response'][0].id_partie,
                nom: data['response'][0].nom,
                prix: data['response'][0].prix,
                lien: data['response'][0].lien,
                image: data['response'][0].image,
                carbone: data['response'][0].carbone
            };

            pieces_selectionnees[i-1]=piece;
            showCurrentPiece(i)    
        }

        displayImages()
        updatePrice()
        localStorage.setItem("savePieces", JSON.stringify(pieces_selectionnees));
    }

    //Bouton permettant de demander au serveur le lancement du scrapping
    let buttonScrapping=document.getElementById("buttonScrapping")
    if(buttonScrapping!=null){
        buttonScrapping.onclick=function(){
            socket.emit("lancerScrapping")
        }
    }

    socket.on("scrappingOK",()=>{
        console.log("scrapping terminé")
    })
   
    //Gestion des boutons et fonctionnalités visibles seulement si l'utilisateur est connecté
    if (localStorage.getItem("isConnected") !== null) {
        //Bouton déconnexion
        document.getElementById("btnLogOut").addEventListener("click", function(){
            localStorage.removeItem("isConnected")
            localStorage.removeItem("userID")
            localStorage.removeItem("isAdmin")
            window.location.reload()
        })

        //Bouton de sauvegarde du vélo
        document.getElementById("saveVelo").addEventListener("click", async function(){
            console.log(pieces_selectionnees)
            let nomVelo=document.getElementById("nomVelo").value

            let msgErreur=document.getElementsByClassName("errMsg")[0]

            if(!isVeloComplet()){
                msgErreur.innerHTML="Votre vélo n'est pas complet."
                
                setTimeout(function() {
                    msgErreur.innerHTML = ""
                }, 3000)

                return
            }
            
            if (nomVelo.trim()==""){
                msgErreur.innerHTML="Le nom de votre vélo ne doit pas être vide."

                setTimeout(function() {
                    msgErreur.innerHTML = ""
                }, 3000)

                return
            }

            const params = {
                id_owner: localStorage.getItem("userID"),
                id_cadre: pieces_selectionnees[0]._id,
                id_pneus: pieces_selectionnees[1]._id,
                id_guidon: pieces_selectionnees[2]._id,
                id_plateau: pieces_selectionnees[3]._id,
                id_selle: pieces_selectionnees[4]._id,
                nom: nomVelo,
                prix: updatePrice()
            };
            console.log(params)

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( params )  
            };

            await fetch('/api/velo/newVelo', options )
                .then( response => response.json() )
                .then( response => {
                    console.log(response)

                } );
            

            document.getElementById("nomVelo").value=""
            
            //Message de confirmation de la sauvegarde du vélo
            msgErreur.style.color = 'green';
            msgErreur.innerHTML="Vélo sauvegardé!"
            setTimeout(function() {
                msgErreur.style.color = 'red';
                msgErreur.innerHTML = ""
            }, 3000)

        })
    }

    //Réception du chemin du PDF de la facture et ouverture dans une autre fenêtre du PDF
    socket.on("pdfPath",(nom_pdf)=>{
        console.log("Génération de la facture sous format PDF: OK")
        let path="../"+nom_pdf+".pdf"
        window.open(path, "_blank");
    })

});
