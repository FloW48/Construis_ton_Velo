document.addEventListener("DOMContentLoaded", async function () {
    let socket = io.connect();

    var popupPiece = document.getElementById("popupPiece");
    var closePopup = document.getElementById("closePopup");

    //Cache le bouton 'Site source' en cas d'un clique autre part sur la page
    document.body.addEventListener("click",function(){
        let infoSite=document.getElementById("infoSite")
        if(typeof(infoSite) != 'undefined' && infoSite != null){
            infoSite.remove()
        }
    })

    //Ferme la fenêtre popup en cas de clique sur le bouton pour la fermer
    closePopup.onclick = function() {
        popupPiece.style.display = "none";
    }

    //Vérifie si l'utilisateur est connecté ou non
    if (localStorage.getItem("isConnected") === null) {
        let errMsg=document.createElement("div")
        errMsg.classList.add("errMsg")
        errMsg.innerHTML="Vous n'êtes pas connecté! <h1>Cliquez <a href=\"connexion.html\">ici</a> pour vous connecter</h1>"
        document.body.appendChild(errMsg)
    }else{

        let vosVelos=document.createElement("h2")
        vosVelos.innerHTML="Vos vélos :"
        document.body.appendChild(vosVelos)

        let bikeList=document.createElement("div")
        bikeList.setAttribute("id","bikeList")
        document.body.appendChild(bikeList)

        var fetch_url="/api/velo/showVelosOfUser?userID="+localStorage.getItem("userID")    //Récupère les vélos de l'utilisateur connecté

        var velosUser= await fetch(fetch_url);
        var data = await velosUser.json();

        if(data['response'].length===0){
            let msgAucunVelo=document.createElement("div")
            msgAucunVelo.classList.add("errMsg")
            msgAucunVelo.innerHTML="Vous n'avez pas encore sauvegardé de vélo!"
            document.body.appendChild(msgAucunVelo)
        }else{          //Crée l'affichage résumant les pièces de chaque vélos
            let num_velo=0
            data['response'].forEach(async function(velo){
                let mainPanel=document.createElement("div")
                mainPanel.classList.add("monVeloInfos")
                
                let titre=document.createElement("div")
                titre.classList.add("titreSection")
                titre.innerHTML=velo.nom

                mainPanel.appendChild(titre)

                let table=document.createElement("table")
                let tbody=document.createElement("tbody")
                let tr1=document.createElement("tr")
                

                let cadre=document.createElement("td")
                cadre.innerHTML="CADRE"
                tr1.appendChild(cadre)

                let pneus=document.createElement("td")
                pneus.innerHTML="PNEU (x2)"
                tr1.appendChild(pneus)

                let guidon=document.createElement("td")
                guidon.innerHTML="GUIDON"
                tr1.appendChild(guidon)

                let plateau=document.createElement("td")
                plateau.innerHTML="PLATEAU"
                tr1.appendChild(plateau)

                let selle=document.createElement("td")
                selle.innerHTML="SELLE"
                tr1.appendChild(selle)

                tbody.appendChild(tr1)

                let tr2=document.createElement("tr")
                let td=document.createElement("td")
                for(let i=0;i<5;i++){
                    tr2.appendChild(td.cloneNode(true))
                }

                tbody.appendChild(tr2)

                table.appendChild(tbody)
                mainPanel.appendChild(table)
                
                let bottom=document.createElement("div")
                bottom.classList.add("bottom")

                let btnFacture=document.createElement("button")
                btnFacture.innerHTML="Facture"
                btnFacture.classList.add("saveButton")

                //Sauvegarde des identifiants de toutes les pièces du vélo dans un tableau à part
                let idpieces_velo=[]
                idpieces_velo.push(velo.id_cadre)
                idpieces_velo.push(velo.id_pneus)
                idpieces_velo.push(velo.id_guidon)
                idpieces_velo.push(velo.id_plateau)
                idpieces_velo.push(velo.id_selle)

                let veloPieces=[]
                
                var fetch_url="/api/utilisateur/showUtilisateur?userID="+localStorage.getItem("userID")
                var infosUtilisateur= await fetch(fetch_url);
                var dataUtilisateur = await infosUtilisateur.json();

                let autresInfos={
                    nomClient:dataUtilisateur['response'].nom,
                    nomVelo:velo.nom,
                    nomFamilleClient: dataUtilisateur['response'].lastname,
                    prenomClient: dataUtilisateur['response'].firstname,
                    telClient: dataUtilisateur['response'].tel,
                    emailClient: dataUtilisateur['response'].email,
                    villeClient: dataUtilisateur['response'].ville,
                    rueClient: dataUtilisateur['response'].rue,
                    cpClient: dataUtilisateur['response'].codepostal
                }
                

                for(let i=0;i<5;i++){
                    fetch_url="/api/equipement/showPiece?pieceID="+idpieces_velo[i]
                    var piece= await fetch(fetch_url);
                    var dataPiece = await piece.json();

                    let infos_piece=dataPiece['response']
                    
                    delete infos_piece['_id'];
                    delete infos_piece['id_partie'];
                    delete infos_piece['carbone'];
                    veloPieces.push(infos_piece)
                }
                
                btnFacture.addEventListener("click", async ()=>{
                    let infosFacture={
                        veloPieces,
                        autresInfos
                    }              
                    socket.emit("facturePDF", infosFacture);
                })

                bottom.appendChild(btnFacture)

                let btnAfficherVelo=document.createElement("button")
                btnAfficherVelo.innerHTML="Afficher vélo"
                btnAfficherVelo.classList.add("afficherVelo")
                btnAfficherVelo.addEventListener("click",async()=>{
                    popupPiece.style.display = "block";
                    displayImages(veloPieces)
                })

                bottom.appendChild(btnAfficherVelo)

                //Bouton permettant de supprimer le vélo actuel
                let btnSupprimerVelo=document.createElement("button")
                btnSupprimerVelo.innerHTML="Supprimer vélo"
                btnSupprimerVelo.classList.add("supprimerVelo")
                btnSupprimerVelo.addEventListener("click",async(event)=>{
                    console.log("supprimer velo", velo._id)
                    var fetch_url="/api/velo/deleteOne?veloID="+velo._id
                    var res= await fetch(fetch_url);
                    var data = await res.json();

                    if(data['err']===0){
                        event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);  //Supprime le vélo côté client
                    }
                })

                bottom.appendChild(btnSupprimerVelo)

                let infoAchat=document.createElement("div")
                infoAchat.classList.add("infoAchat")
                bottom.appendChild(infoAchat)

                //Gère l'affichage dépendant de si le vélo a été acheté ou non
                let isBought=velo.isBought
                if(!isBought){
                    infoAchat.innerHTML="Ce vélo n'a pas été acheté"

                    let btnAcheterVelo=document.createElement("button")
                    btnAcheterVelo.innerHTML="Acheter vélo"
                    btnAcheterVelo.classList.add("acheterVelo")
                    btnAcheterVelo.addEventListener("click",async(event)=>{
                        console.log("acheter velo", velo._id)
                        var fetch_url="/api/velo/acheterVelo?veloID="+velo._id
                        var res= await fetch(fetch_url);
                        var data = await res.json();

                        if(data['err']===0){
                            infoAchat.innerHTML="Ce vélo a été acheté"
                        }
                    })
                    infoAchat.appendChild(btnAcheterVelo)
                }else{
                    infoAchat.innerHTML="Ce vélo a été acheté"
                }


                mainPanel.appendChild(bottom)

                bikeList.appendChild(mainPanel)

                for(let i=0;i<5;i++){
                    displayPiece(idpieces_velo[i],num_velo,i)
                }
            
                num_velo++
            })
        }        
    }

    /**
     * Affiche le vélo en bas de la page en affichant les images de chaque parties du vélo
     * @param {array} infos_velo  Tableau contenant les informations du vélo à afficher
    */
    async function displayImages(infos_velo){
        console.log("infos velo", infos_velo)
        let cadre=document.getElementById("cadre")
        let roueG=document.getElementById("roueG")
        let roueD=document.getElementById("roueD")
        let guidon=document.getElementById("guidon")
        let plateau=document.getElementById("plateau")
        let selle=document.getElementById("selle")


        let img=cadre.firstElementChild
        if(infos_velo[0]!=undefined){
            socket.emit("askImgBase64",infos_velo[0].image,function(imageBase64){                
                displayImageContouring("cadre",imageBase64)
            })
        }else{
            img.src="./images/site/empty.png"
        }
        
        

        img=roueG.firstElementChild
        if(infos_velo[1]!=undefined){
            socket.emit("askImgBase64",infos_velo[1].image,function(imageBase64){                
                displayImageContouring("roueG",imageBase64)
                displayImageContouring("roueD",imageBase64)
            })
        }else{
            img.src="./images/site/empty.png"
            img=roueD.firstElementChild
            img.src="./images/site/empty.png";
        }
        
        
        img=guidon.firstElementChild
        if(infos_velo[2]!=undefined){
            socket.emit("askImgBase64",infos_velo[2].image,function(imageBase64){
                displayImageContouring("guidon",imageBase64)
            })        
        }else{
            img.src="./images/site/empty.png"
        }

        img=plateau.firstElementChild
        if(infos_velo[3]!=undefined){
            socket.emit("askImgBase64",infos_velo[3].image,function(imageBase64){                
                displayImageContouring("plateau",imageBase64)
            })
        }else{
            img.src="./images/site/empty.png"
        }
        
        img=selle.firstElementChild
        if(infos_velo[4]!=undefined){
            socket.emit("askImgBase64",infos_velo[4].image,function(imageBase64){                
                displayImageContouring("selle",imageBase64)
            })        
        }else{
            img.src="./images/site/empty.png"
        }
        
    }

    /**
     * Affichage d'une pièce dans le cadre de l'affichage du vélo, en faisant un traitement pour retirer son fond blanc
     * @param {string} nom_piece - Nom de la partie représentée (ex: "cadre", "guidon" etc..)
     * @param {string} base64 - Valeur base64 de l'image à afficher
    */
    async function displayImageContouring(nom_piece,base64){
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
            newColor = {r:150,g:150,b:120, a:0};
            for (var i = 0, n = pix.length; i <n; i += 4) {
                var r = pix[i],
                        g = pix[i+1],
                        b = pix[i+2];
            
                    if( (r <= 255 && r > 200)       //Vérifie si le pixel actuel est dans les tons blancs
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

    //Ouvre le PDF généré dans une nouvelle fenêtre, après sa création par le serveur
    socket.on("pdfPath",(nom_pdf)=>{
        console.log("Génération de la facture sous format PDF: OK")
        let path="../"+nom_pdf+".pdf"
        window.open(path, "_blank");
    })
    
});


/**
 * Créé un élément qui présente les informations d'une pièce: son nom, son prix, son image et son lien source
 * @param {integer} id_piece Identifiant unique de la piece
 * @param {integer} num_velo Numéro du velo dans la liste
 * @param {integer} num_piece Type de piece (0: Cadre, 1: Pneu, 2: Guidon, 3: Plateau, 4: Selle)
*/
async function displayPiece(id_piece, num_velo, num_piece){
    var fetch_url="/api/equipement/showPiece?pieceID="+id_piece

    var piece= await fetch(fetch_url);
    var data = await piece.json();

    let infos_piece=data['response']
    
    let pieceSelected = document.createElement("div");
    pieceSelected.classList.add("pieceSelected");

    //NOM PIECE
    let nom_article=document.createElement("h1");
    nom_article.textContent=infos_piece.nom;
    pieceSelected.appendChild(nom_article);
    
    //IMAGE
    let img=document.createElement("img")
    img.src=infos_piece.image                                //LIEN DE L'IMAGE
    pieceSelected.appendChild(img)

    let table=document.createElement("table");
    
    //LIGNE PRIX
    let trPrice=document.createElement('tr');

    let priceValue=document.createElement('td');
    priceValue.textContent=infos_piece.prix+'\u20AC';
    trPrice.appendChild(priceValue);

    table.appendChild(trPrice);

    //LIGNE SITE SOURCE
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
        infoSite.innerHTML="<a href=\""+infos_piece.lien+"\" target=\"_blank\">Site source</a>"
        
        infoSite.addEventListener("click", function(e){ //Empêche d'ouvrir la sélection de pièce lors du clique sur le lien source
            e.stopPropagation()         
        })

        e.target.parentNode.appendChild(infoSite)
    })
    siteValue.appendChild(btnInfoSite)

    trSite.appendChild(siteValue);

    table.appendChild(trSite);

    
    pieceSelected.appendChild(table)
    let td=document.createElement("td")
    td.appendChild(pieceSelected)

    let bikeList=document.getElementById("bikeList")
    bikeList.childNodes[num_velo].childNodes[1].childNodes[0].childNodes[1].childNodes[num_piece].appendChild(pieceSelected)

    return pieceSelected
}


