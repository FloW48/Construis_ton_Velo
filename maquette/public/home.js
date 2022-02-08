var pieces_selectionnees=new Array(5)
var prixTotal=0


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

}



document.addEventListener("DOMContentLoaded", async function () {
    let socket = io.connect();

    let saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", ()=>{
        if(document.getElementById("containerImage").children.length === 1 && document.getElementById("cadre").children.length === 6){
            let velo = [];
            let savePieces = JSON.parse(localStorage.getItem("savePieces"));
            for(let elem of savePieces){
                delete elem['_id'];
                delete elem['id_partie'];
                delete elem['carbone'];
                
                velo.push(elem);
            }
            socket.emit("sauvegarder", velo);
        }else{
            alert("Il vous faut un vélo complet pour le sauvegarder");
        }
    })
    
    //Charge les données du Local storage
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

    var popupPiece = document.getElementById("popupPiece");
    var closePopup = document.getElementById("closePopup");
    var elements_showPieces = document.getElementsByClassName("showPiece");
    var importDataPreset = document.getElementById("importDataPreset");

    updatePrice()

    //Affiche le vélo en bas de page
    function displayImages(){
        let cadre=document.getElementById("cadre")
        let roueG=document.getElementById("roueG")
        let roueD=document.getElementById("roueD")
        let guidon=document.getElementById("guidon")
        let plateau=document.getElementById("plateau")
        let selle=document.getElementById("selle")


        let img=cadre.firstElementChild
        if(pieces_selectionnees[0]!=undefined){
            img.src=pieces_selectionnees[0].image;
        }else{
            img.src="./images/site/empty.png"
        }
        
        

        img=roueG.firstElementChild
        if(pieces_selectionnees[1]!=undefined){
            img.src=pieces_selectionnees[1].image;
            img=roueD.firstElementChild
            img.src=pieces_selectionnees[1].image;
        }else{
            img.src="./images/site/empty.png"
            img=roueD.firstElementChild
            img.src="./images/site/empty.png";
        }
        
        
        img=guidon.firstElementChild
        if(pieces_selectionnees[2]!=undefined){
            img.src=pieces_selectionnees[2].image;
        }else{
            img.src="./images/site/empty.png"
        }

        img=plateau.firstElementChild
        if(pieces_selectionnees[3]!=undefined){
            img.src=pieces_selectionnees[3].image;
        }else{
            img.src="./images/site/empty.png"
        }
        
        img=selle.firstElementChild
        if(pieces_selectionnees[4]!=undefined){
            img.src=pieces_selectionnees[4].image;
        }else{
            img.src="./images/site/empty.png"
        }
        
    }

    //Affiche toutes les pièces correspondantes à un id (id défini dans un attribut data-idpiece lors du clique sur l'élément dans la page HTML)
    var function_showPieces = async function() {
        var idpiece = this.getAttribute("data-idpiece");
        var popupcontent=document.getElementsByClassName("popup-content")[0];
        popupcontent.innerHTML=""
        
        var nom_piece="";
        
        popupPiece.style.display = "block";

        var fetch_url="http://localhost:8080/api/equipement/showPieces?pieceID="+idpiece

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
                nom_piece="{inconnu}"
        }

        let titrePopup=document.createElement("h1");
        titrePopup.textContent="Liste des " + nom_piece + " disponibles :"
        popupcontent.appendChild(titrePopup)

        var piecesCadres= await fetch(fetch_url);
        var data = await piecesCadres.json();

        console.log(data)

        data['response'].forEach(function(element){ 
            let piecePopup = document.createElement("div");
            piecePopup.className="piecePopup";

            var data_idarticle = document.createAttribute("data-idarticle");
            data_idarticle.value = element._id;
            piecePopup.setAttributeNode(data_idarticle);

            piecePopup.addEventListener("click", function () {

                var piece = {
                    _id: element._id,
                    id_partie: element.id_partie,
                    nom: element.nom,
                    prix: element.prix,
                    lien: element.lien,
                    image: element.image,
                    carbone: element.carbone
                };

                /*
                
                //Enlever le style 'selected' à l'article précedemment choisi si il existe
                if(pieces_selectionnees[idpiece-1] != undefined){
                    let idarticle_curr=pieces_selectionnees[idpiece-1]._id;
                    console.log(idarticle_curr)
                    let article_curr = document.querySelector("[data-idarticle='"+idarticle_curr+"']")
                    article_curr.classList.remove("selected")
                    updatePrice();
                }

                piecePopup.classList.add("selected");       //Ajout du style 'selected' à l'article choisi

                */

                pieces_selectionnees[idpiece-1]=piece; //Sauvegarde l'article en tant que l'article choisi

                showCurrentPiece(idpiece);

                displayImages()
                updatePrice()
                localStorage.setItem("savePieces", JSON.stringify(pieces_selectionnees));
            });
            
            /*
            if( pieces_selectionnees[idpiece-1]!=undefined && pieces_selectionnees[idpiece-1]._id == element._id){
                piecePopup.classList.add("selected");
            }*/

            //NOM PIECE
            let nom_article=document.createElement("h1");
            nom_article.textContent=element.nom;
            piecePopup.appendChild(nom_article);
            
            //IMAGE
            let img=document.createElement("img")
            img.src=element.image                                //LIEN DE L'IMAGE
            piecePopup.appendChild(img)

            let table=document.createElement("table");
            
            //LIGNE PRIX
            let trPrice=document.createElement('tr');

            let price=document.createElement('td');
            price.textContent="Prix";
            trPrice.appendChild(price);

            let priceValue=document.createElement('td');
            priceValue.textContent=element.prix+'\u20AC';
            trPrice.appendChild(priceValue);

            table.appendChild(trPrice);

            //LIGNE SITE SOURCE
            let trSite=document.createElement('tr');

            let site=document.createElement('td');
            site.textContent="Site source";
            trSite.appendChild(site);

            let siteValue=document.createElement('td');
            let siteA=document.createElement('a');
            siteA.setAttribute("href", element.lien)
            siteA.setAttribute("target", "blank")
            siteA.textContent=element.lien;
            siteValue.appendChild(siteA);
            trSite.appendChild(siteValue);

            table.appendChild(trSite);

            //LIGNE EMISSION CARBONE
            let trCarbone=document.createElement('tr');

            let carbone=document.createElement('td');
            carbone.textContent="Emission carbone";
            trCarbone.appendChild(carbone);

            let carboneValue=document.createElement('td');
            carboneValue.textContent=element.carbone;
            trCarbone.appendChild(carboneValue);

            table.appendChild(trCarbone);

            piecePopup.appendChild(table)

            document.getElementsByClassName("popup-content")[0].appendChild(piecePopup)
        })
    };

    for (var i = 0; i < elements_showPieces.length; i++) {
        elements_showPieces[i].addEventListener('click', function_showPieces, false);
    }
    
    closePopup.onclick = function() {
        document.getElementsByClassName("popup-content")[0].innerHTML="";
        popupPiece.style.display = "none";
    }

    function showCurrentPiece(idpiece){
        let pieceSelected = document.getElementsByClassName("showPiece")[idpiece-1].firstElementChild;
        pieceSelected.textContent="";

        //NOM PIECE
        let nom_article=document.createElement("h1");
        nom_article.textContent=pieces_selectionnees[idpiece-1].nom;
        pieceSelected.appendChild(nom_article);
        
        //IMAGE
        let img=document.createElement("img")
        img.src=pieces_selectionnees[idpiece-1].image                                //LIEN DE L'IMAGE
        pieceSelected.appendChild(img)

        let table=document.createElement("table");
        
        //LIGNE PRIX
        let trPrice=document.createElement('tr');

        let price=document.createElement('td');
        price.textContent="Prix";
        trPrice.appendChild(price);

        let priceValue=document.createElement('td');
        priceValue.textContent=pieces_selectionnees[idpiece-1].prix+'\u20AC';
        trPrice.appendChild(priceValue);

        table.appendChild(trPrice);

        //LIGNE SITE SOURCE
        let trSite=document.createElement('tr');

        let site=document.createElement('td');
        site.textContent="Site source";
        trSite.appendChild(site);

        let siteValue=document.createElement('td');
        let siteA=document.createElement('a');
        siteA.setAttribute("href", pieces_selectionnees[idpiece-1].lien)
        siteA.setAttribute("target", "blank")
        siteA.textContent=pieces_selectionnees[idpiece-1].lien;
        siteValue.appendChild(siteA);
        trSite.appendChild(siteValue);

        table.appendChild(trSite);

        //LIGNE EMISSION CARBONE
        let trCarbone=document.createElement('tr');

        let carbone=document.createElement('td');
        carbone.textContent="Emission carbone";
        trCarbone.appendChild(carbone);

        let carboneValue=document.createElement('td');
        carboneValue.textContent=pieces_selectionnees[idpiece-1].carbone;
        trCarbone.appendChild(carboneValue);

        table.appendChild(trCarbone);

        pieceSelected.appendChild(table)
    }


    let delPieces=document.getElementsByClassName("delPiece")
    for (var i = 0; i < 5; i++) {
        delPieces[i].addEventListener('click', function(){
            idpiece=this.getAttribute("data-idpiece")
            let showPiece=document.getElementsByClassName("showPiece")[idpiece-1]
            showPiece.innerHTML="<div class=\"pieceSelected\"><h1>Sélectionner une pièce</h1></div>"

            pieces_selectionnees[idpiece-1]=undefined;
            displayImages()
            updatePrice()
            localStorage.setItem("savePieces", JSON.stringify(pieces_selectionnees));
            socket.emit("changePiece",()=>{
                console.log("Update émis");
            });
        });
    }

    let optPrix = document.getElementById("optPrix");
    optPrix.onclick = async function(){
        var fetch_url;
        var pieceMinPrice;
        var data;

        for(let i=1;i<6;i++){
            fetch_url="http://localhost:8080/api/equipement/findMinPrice?pieceID="+i
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

    //Import de données préfaites
    importDataPreset.onclick=async function(){
        fetch('http://localhost:8080/importDataPreset')
    }

    let buttonScrapping=document.getElementById("buttonScrapping")
    buttonScrapping.onclick=function(){
        socket.emit("lancerScrapping")
    }

    socket.on("scrappingOK",()=>{
        console.log("scrapping terminé")
    })
    
    load()
});
