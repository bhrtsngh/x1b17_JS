console.log("Start");
let AdFoundArrAdios = [];
let AdFoundArrAuditude = [];
let NoAdAuditude = [];
let NoPodAuditude = [];
var request=0;

function asynCalltoFile(file){
        fetch(file).then((response)=>{
            return response.text();
        }).then((text)=>{
            getData(text);
        })
}


asynCalltoFile("wurl_4Days");

async function getData(data){
   let splitNewLine = data.split('\n'),eachRecord;
   let noOfLines = splitNewLine.length;
    console.log(noOfLines);
    forLoop = async(i) => {
        for(i=0;i<100;i++){
            eachRecord = splitNewLine[i].match(/(?<=GET\s+).*?(?=\s+HTTP)/gs);
            adios(eachRecord,i);
            auditude(eachRecord,i);
            request =i;
            await itemRunner(i);
        }
    }
    forLoop();
}

async function itemRunner(item){
    await delay();
    //console.log(item);
}
var countPromise=0;
function delay(){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 200);
    })
        
 }

setTimeout(function(){
    AdFoundArrAdios = AdFoundArrAdios.sort();
    AdFoundArrAuditude = AdFoundArrAuditude.sort();
    diffValue = AdFoundArrAuditude.length - AdFoundArrAdios.length;
    console.log("Difference is - "+diffValue+" out of Total "+request+1+" request");

    let difference = AdFoundArrAuditude
                 .filter(x => !AdFoundArrAdios.includes(x))
                 .concat(AdFoundArrAdios.filter(x => !AdFoundArrAuditude.includes(x)));
    console.log(difference);
    //generateCSV(difference);
    generateCSV(NoAdAuditude);


},10000)

function generateCSV(data){
    var CsvString = "";
    data.forEach(function(RowItem, RowIndex) {
        CsvString += RowItem + ',';
        CsvString += "\r\n";
    });
    CsvString = "data:application/csv," + encodeURIComponent(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString );
    x.setAttribute("download","ABDiffResult.csv");
    document.body.appendChild(x);
    x.click()
}



function adios(record,requestIndex){
    if(record!=null){
        let audDomain = "http://ad.primetime.adobe.com"
        let auditudeURL = audDomain + record;
        getXMLResponse(auditudeURL,requestIndex,audDomain,record);
    }
}

function auditude(record,requestIndex){
    if(record!=null){
        let audDomain = "http://ad.auditude.com"
        let auditudeURL = audDomain + record;
        getXMLResponse(auditudeURL,requestIndex,audDomain,record);
    }
}

 function getXMLResponse(url,requestIndex,domain,record){
        let x = new XMLHttpRequest();
        x.open("GET", url, true);
        x.onreadystatechange = function () {
        if (x.readyState == 4 && x.status == 200){
            let doc = x.responseXML;
            x = doc.documentElement.childNodes;
            var txt,adDetails,j=0;
            for (i = 0; i < x.length ;i++) {
                txt = x[i].nodeName; 
                if (txt == "Body"){   
                     pod = x[i].getElementsByTagName("Pod")[0];
                        if(pod){
                            if(pod.getElementsByTagName("Lot")[0]){
                                adDetails = pod.getElementsByTagName("Lot")[0].getElementsByTagName("Ad")[0];
                                if(adDetails){
                                    adSystem = adDetails.getElementsByTagName("AdSystem")[0].textContent;
                                    redirectURL = adDetails.getElementsByTagName("AdTagURI")[0].textContent;
                                    redirectURL=removeURLParameter_cb(redirectURL);
                                    adID = adDetails.getAttribute("id");
                                    if(domain=="http://ad.auditude.com"){
                                        //AdFoundArrAuditude.push(record+" "+adSystem+" "+redirectURL);
                                       // AdFoundArrAuditude.push(record);
                                      //  AdFoundArrAuditude.push(adSystem);
                                      //  AdFoundArrAuditude.push(redirectURL);
                                    }
                                    if(domain=="http://ad.primetime.adobe.com"){
                                       // AdFoundArrAdios.push(record+" "+adSystem+" "+redirectURL);    
                                    }
                                    
                                    //console.log(adID,adSystem,redirectURL);
                                    //console.log(requestIndex,"Ad Found");
                                }
                                else {
                                    console.log(requestIndex,"No Ad Found");
                                //console.log(i);
                                }
                            }
                            else {
                                console.log(requestIndex,"No Lot Found");
                                NoAdAuditude.push(url);
                            }
                            
                        }    
                        else {
                            console.log(requestIndex,"No Pod Found "+ pod);
                            NoPodAuditude.push(url);

                        }             
                 }        
            }
            //
        }
    };
    x.send(null);
    //return AdFoundArr;
} 


function removeURLParameter_cb(url) {
    var urlparts= url.split('?');   
    if (urlparts.length>=2) {

        var prefix= encodeURIComponent("cb")+'=';
        var pars= urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (let i= pars.length; i-- > 0;) {    
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }

        url= urlparts[0]+'?'+pars.join('&');
        return url;
    } else {
        return url;
    }
}


//console.log(AdFoundArr.length);