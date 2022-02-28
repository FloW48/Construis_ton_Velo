
document.addEventListener("DOMContentLoaded", async function () {
    
    if (localStorage.getItem("isConnected") === null) {
        let errMsg=document.createElement("div")
        errMsg.classList.add("errMsg")
        errMsg.innerHTML="Vous n'êtes pas connecté! <h1>Cliquez <a href=\"connexion.html\">ici</a> pour vous connecter</h1>"
        document.body.appendChild(errMsg)
        
    }else{
        let vosVelos=document.createElement("div")
        vosVelos.classList.add("vosVelos")
        vosVelos.innerHTML="Vos vélos: "
        document.body.appendChild(vosVelos)

        var fetch_url="http://localhost:8080/api/velo/showVelosOfUser?userID="+localStorage.getItem("userID")

        var velosUser= await fetch(fetch_url);
        var data = await velosUser.json();

        console.log(data)

        let cpt=0
        data['response'].forEach(function(velo){
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
            tbody.appendChild(tr2)

            table.appendChild(tbody)
            mainPanel.appendChild(table)

            document.body.appendChild(mainPanel)

            displayPiece(velo.id_cadre,cpt)
            displayPiece(velo.id_pneus,cpt)
            displayPiece(velo.id_guidon,cpt)
            displayPiece(velo.id_plateau,cpt)
            displayPiece(velo.id_selle,cpt)
            cpt++
            
        })
    }
});

async function displayPiece(id_piece, num_velo){
    var fetch_url="http://localhost:8080/api/equipement/showPiece?pieceID="+id_piece

    var piece= await fetch(fetch_url);
    var data = await piece.json();

    let infos_piece=data['response'][0]
    
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

    let price=document.createElement('td');
    price.textContent="Prix";
    trPrice.appendChild(price);

    let priceValue=document.createElement('td');
    priceValue.textContent=infos_piece.prix+'\u20AC';
    trPrice.appendChild(priceValue);

    table.appendChild(trPrice);

    //LIGNE SITE SOURCE
    let trSite=document.createElement('tr');

    let site=document.createElement('td');
    site.textContent="Site source";
    trSite.appendChild(site);

    let siteValue=document.createElement('td');
    let siteA=document.createElement('a');
    siteA.setAttribute("href", infos_piece.lien)
    siteA.setAttribute("target", "blank")
    siteA.textContent=infos_piece.lien;
    siteValue.appendChild(siteA);
    trSite.appendChild(siteValue);

    table.appendChild(trSite);

    //LIGNE EMISSION CARBONE
    let trCarbone=document.createElement('tr');

    let carbone=document.createElement('td');
    carbone.textContent="Emission carbone";
    trCarbone.appendChild(carbone);

    let carboneValue=document.createElement('td');
    carboneValue.textContent=infos_piece.carbone;
    trCarbone.appendChild(carboneValue);

    table.appendChild(trCarbone);

    pieceSelected.appendChild(table)
    let td=document.createElement("td")
    td.appendChild(pieceSelected)

    document.body.childNodes[num_velo+4].childNodes[1].childNodes[0].childNodes[1].appendChild(td)

    return pieceSelected
}