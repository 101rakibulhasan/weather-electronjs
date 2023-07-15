const api = "http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=ErjXgI4B5q8sahrz5TR3qCAuxHbqhRHv&q=";

var loc = window.location.pathname;
var dir1 = loc.substring(0, loc.lastIndexOf('/'));
var dir = dir1.substring(0, dir1.lastIndexOf('/')) + "/setting.json";

ok = document.querySelector(".ok");
query = document.getElementById("loc");
ok.addEventListener("click", () => {
        checkoffline();
        makesugg();
})

function checkoffline(){
        if(navigator.onLine)
        {
                
        }else{
                ipcRenderer.send("checkoffline");
        }
}

query.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
                makesugg();
                playSugg();
                checkoffline();
        }
})

function makesugg(){
        const url = api+query.value;
        fetch(url)
        .then(response => {
                return response.json();
        })
        .then(data => {
                document.querySelector(".list").innerHTML = ""; 
                for (let i of data)
                {
                        let listitem = document.createElement("li");
                        listitem.classList.add("list-items");
                        listitem.style.cursor = "pointer";
                        const local = i.LocalizedName+", "+ i.Country.LocalizedName;
                        listitem.setAttribute("onclick", "displayNames('" + local+"',"+ i.Key +")");
                        listitem.innerHTML = local;
                        document.querySelector(".list").appendChild(listitem);
                }
        })
}

function displayNames(value,pos) {
        query.value = value;
        ipcRenderer.send('parseJSON_pos',pos);
        ipcRenderer.send('parseJSON_loc',value);
        
}

function playSugg(){
        const sugg = document.getElementById("sugg");
        sugg.style.animation = 'open_sugg 2s ease forwards'
}

done = document.querySelector(".confirm");
done.addEventListener("click", () => {
        fetch(dir)
        .then(response => {
                return response.json();
        })
        .then(data => {
                lockey = data.loc_key;
                if(lockey != -1)
                {
                        ipcRenderer.send('parseJSON_isSetup',1);
                        ipcRenderer.send('go-main');
                }else{
                        ipcRenderer.send('parseJSON_isSetup',0);
                }
        })
})

cel = document.querySelector(".celsius");
far = document.querySelector(".farenite");

fetch(dir)
        .then(response => {
                return response.json();
        })
        .then(data => {
        if(data.unit == "C"){
                cel.style.borderBottom = "1px solid white";
        }else
        {
                far.style.borderBottom = "1px solid white";
        }
        })

far.addEventListener("click", () => {  
        far.style.borderBottom = "1px solid white";
        cel.style.borderBottom = "0";
        ipcRenderer.send('parseJSON_unit',"F");
})

cel.addEventListener("click", () => {
        cel.style.borderBottom = "1px solid white";
        far.style.borderBottom = "0";
        ipcRenderer.send('parseJSON_unit',"C");
})