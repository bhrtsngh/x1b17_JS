console.log("Start");
let AdFoundArrAdios = [];
let AdFoundArrAuditude = [];
var request=0;

function asynCalltoFile(file){
        fetch(file).then((response)=>{
            return response.text();
        }).then((text)=>{
            getData(text);
        })
}

//asynCalltoFile("wurl_1.5");
//asynCalltoFile("test");
asynCalltoFile("wurl_4Days");

async function getData(data){
   let splitNewLine = data.split('\n'),eachRecord;
   let noOfLines = splitNewLine.length;
    //console.log(noOfLines)
    for(i=0;i<1000;i++){
        eachRecord = splitNewLine[i].match(/(?<=GET\s+).*?(?=\s+HTTP)/gs);
        adios(eachRecord,i);
        auditude(eachRecord,i);
        request =i;
        await itemRunner(i);
    }
    
}

async function itemRunner(item){
    await delay();
    console.log(item);
}

function delay(){
    //return new Promise(){ (resolve => setTimeout(resolve, 3000))}

    return new Promise(function(resolve, reject)
    {
        setTimeout(resolve, 300);
        //.then(data => resolve(data))
        //.catch(err => reject(err));
    });
        
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

    var CsvString = "";
    difference.forEach(function(RowItem, RowIndex) {
        CsvString += RowItem + ',';
        CsvString += "\r\n";
    });
    CsvString = "data:application/csv," + encodeURIComponent(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString );
    x.setAttribute("download","somedata.csv");
    document.body.appendChild(x);
    x.click()


},10000)

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
                                        AdFoundArrAuditude.push(record+" "+adSystem+" "+redirectURL);
                                       // AdFoundArrAuditude.push(record);
                                      //  AdFoundArrAuditude.push(adSystem);
                                      //  AdFoundArrAuditude.push(redirectURL);
                                    }
                                    if(domain=="http://ad.primetime.adobe.com"){
                                        AdFoundArrAdios.push(record+" "+adSystem+" "+redirectURL);    
                                    }
                                    
                                    //console.log(adID,adSystem,redirectURL);
                                   // console.log(requestIndex,"Ad Found");
                                }
                                else {
                                  //  console.log(requestIndex,"No Ad Found");
                                //console.log(i);
                                }
                            }
                            else {
                               // console.log(requestIndex,"No Lot Found");
                            }
                            
                        }    
                        else {
                            //console.log(requestIndex,"No Pod Found");

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
    //prefer to use l.search if you have a location/link object
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