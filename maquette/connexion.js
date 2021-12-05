let buttonGuidon = document.getElementById("onlyguidon");

buttonGuidon.addEventListener("click", ()=>{
    console.log("Voici tous les guidons : ");
    console.log(equipement.aggregate({
        $filter: {
            id_partie: 1
        }
    }));
    console.log("Test pour tout afficher");
    console.log(db.getCollection('equipement').find({}));
});

let buttonSelle = document.getElementById("onlyselle");

buttonSelle.addEventListener("click", ()=>{
    console.log("Voici toutes les selles : ");
    console.log(equipement.aggregate({
        $filter: {
            id_partie: 2
        }
    }));
    console.log("Test pour tout afficher");
    console.log(db.getCollection('equipement').find({}));
});