var pieces_selectionnees=new Array(5)




document.addEventListener("DOMContentLoaded", async function () {
    var equipement = await fetch("http://localhost:8080/api/equipement");    
    var data = await equipement.json();
    
    var popupPiece = document.getElementById("popupPiece");
    var closePopup = document.getElementById("closePopup");
    var elements_showPieces = document.getElementsByClassName("showPiece");
    var importDataPreset = document.getElementById("importDataPreset");

    //Affiche toutes les pièces correspondantes à un id (id défini dans un attribut data-idpiece lors du clique sur l'élément dans la page HTML)
    var function_showPieces = async function() {
        var idpiece = this.getAttribute("data-idpiece");
        var nom_piece="";
        
        popupPiece.style.display = "block";

        var fetch_url="http://localhost:8080/api/equipement/showPieces?pieceID="+idpiece

        switch(idpiece){
            case "1":
                nom_piece="cadres"
                break
            case "2":
                nom_piece="roues"
                break
            case "3":
                nom_piece="guidons"
                break
            case "4":
                nom_piece="vitesses"
                break
            case "5":
                nom_piece="selles"
                break
            default:
                nom_piece="{inconnu}"
        }

        let titrePopup=document.createElement("h1");
        titrePopup.textContent="Liste des " + nom_piece + " disponibles :"
        document.getElementsByClassName("popup-content")[0].appendChild(titrePopup)

        var piecesCadres= await fetch(fetch_url);
        var data = await piecesCadres.json();

        console.log(data)

        data['response'].forEach(function(element){ 
            let piecePopup = document.createElement("div");
            piecePopup.className="piecePopup";

            console.log(element)
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

                
                //Enlever le style 'selected' à l'article précedemment choisi si il existe
                if(pieces_selectionnees[idpiece-1] != undefined){
                    let idarticle_curr=pieces_selectionnees[idpiece-1]._id;
                    let article_curr = document.querySelector("[data-idarticle='"+idarticle_curr+"']")
                    article_curr.classList.remove("selected")
                }

                piecePopup.classList.add("selected");       //Ajout du style 'selected' à l'article choisi

                pieces_selectionnees[idpiece-1]=piece; //Sauvegarde l'article en tant que l'article choisi

                showCurrentPiece(idpiece);
            });
            
            if( pieces_selectionnees[idpiece-1]!=undefined && pieces_selectionnees[idpiece-1]._id == element._id){
                piecePopup.classList.add("selected");
            }

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

    importDataPreset.onclick=async function(){
        fetch('http://localhost:8080/importDataPreset')
    }

});