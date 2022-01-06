document.addEventListener("DOMContentLoaded", async function () {
    var equipement = await fetch("http://localhost:8080/api/equipement");    
    var data = await equipement.json();
    
    window.addEventListener('keydown', function (e) {
        if (e.code === 'KeyD') {
            e.preventDefault();
            document.body.innerHTML+=data['response'][0]['prix'];
        }
    });


    var popupPiece = document.getElementById("popupPiece");
    var showCadres = document.getElementById("showCadres");
    var showRoues = document.getElementById("showRoues");
    var showGuidons = document.getElementById("showGuidons");
    var showVitesses = document.getElementById("showVitesses");
    var showSelles = document.getElementById("showSelles");
    var closePopup = document.getElementById("closePopup");

    // When the user clicks the button, open the modal 
    showCadres.onclick = async function() {
        popupPiece.style.display = "block";
        var piecesCadres= await fetch("http://localhost:8080/api/equipement/showPieces?pieceID=1");
        var data = await piecesCadres.json();
        var infos="";
        console.log(data)

        data['response'].forEach(function(element){ 
            let piecePopup = document.createElement("div");
            piecePopup.className="piecePopup";
            
            //NOM PIECE
            let nom_piece=document.createElement("h1");
            nom_piece.textContent="[NOM PIECE]"
            piecePopup.appendChild(nom_piece)
            
            //IMAGE
            let img=document.createElement("img")
            //img.src=""                                //LIEN DE L'IMAGE
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
        });


    }
    
    closePopup.onclick = function() {
        document.getElementsByClassName("popup-content")[0].innerHTML="";
        popupPiece.style.display = "none";
    }


});