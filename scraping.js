const axios = require("axios")
const {JSDOM} = require("jsdom")
const URL = "https://www.probikeshop.fr/bmx/"
let dataBikes = {}

let titles = []


start()

async function start(){

    
    const { data } = await axios.get(URL)
    const dom = new JSDOM(data, {
      runScripts: "dangerously",
      resources: "usable",
      url:"https://www.probikeshop.fr/bmx/"
    });
    const { document } = dom.window;

    let bigCategories = document.querySelectorAll(".subMenuElem")
    let middleCategories = document.querySelectorAll(".subMenuListLvl2")


    for(let bigCat of bigCategories){
        if(bigCat.children[0].title && bigCat.children[0].children.length != 1){
            titles.push(bigCat.children[0].title)
            dataBikes[bigCat.children[0].title] = {
                type: bigCat.children[0].title, 
                url : bigCat.children[0].href,
                children : {}
            }
        }
    }

    let typeCounter = -1
    let lastUrl = undefined

    let lastLvL2Name = undefined

    for(let midCat of middleCategories){
        for(let subMenuElem of midCat.children){
            if(subMenuElem.classList.contains("subMenuElemLvl2")){
                let urlIdentifier = subMenuElem.children[0].href.split("/")[4].split("-")
                urlIdentifier = urlIdentifier[0] + urlIdentifier[1]
                if(urlIdentifier != lastUrl){
                    typeCounter += 1
                    lastUrl = urlIdentifier
                }
        
                lastLvL2Name = subMenuElem.children[0].title

                dataBikes[titles[typeCounter]].children[subMenuElem.children[0].title] = {
                    component: subMenuElem.children[0].title,
                    url : subMenuElem.children[0].href,
                    children: {}
                }
            }
            else if(subMenuElem.classList.contains("subMenuLvl3")){
                for(let elem of subMenuElem.children[0].children){
                    dataBikes[titles[typeCounter]].children[lastLvL2Name].children = {
                        component: elem.children[0].title,
                        url: elem.children[0].href
                    }
                }
            }
        }
    }
    
    getDataOfBikes(dataBikes)

}

async function getDataOfBikes(component){
    
    for(let elem in component){
        elem = component[elem]

        getDataOfBikes(elem.children)

        const { data } = await axios.get(elem.url)

        const dom = new JSDOM(data, {
            runScripts: "dangerously",
            resources: "usable",
            url:elem.url
        }); 

        const { document } = dom.window;

        if(!elem["products"]){
            elem["products"] = []
        }

        let products; 

        if(document.querySelectorAll(".productBest_item") != 0){
            products = document.querySelectorAll(".productBest_item")
        }
        else{
            products = document.querySelectorAll(".listingProduct_grid")
        }

        for(let product of products){
            product = product.children[0]

            elem["products"].push({
                url : product.children[1].href,
                imgURL : product.children[1].children[0].children[0].src,
                title: product.children[1].children[1].children[0].title,
                price : product.children[1].children[2].children[0].innerHTML
            })
        }


    }
}