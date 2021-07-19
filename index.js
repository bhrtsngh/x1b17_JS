console.log("Start");
let AdFoundArrAdios = [];
let AdFoundArrAuditude = [];
let NoAdAuditude = [];
let NoPodAuditude = [];
var request=0;
let recordArr = [];
let totalCalls = 70;

function asynCalltoFile(file){
        fetch(file).then((response)=>{
            return response.text();
        }).then((text)=>{
            getData(text);
        })
}


asynCalltoFile("nbc");



async function getData(data){
   let splitNewLine = data.split('\n'),eachRecord;
   let noOfLines = splitNewLine.length;
    console.log(noOfLines);

    for(i=1;i<totalCalls;i++){
      //await waitforme(1);
      eachRecord = splitNewLine[i].match(/(?<=GET\s+).*?(?=\s+HTTP)/gs);
      callAdRequest(eachRecord,i);
    }
        console.log("Total Request "+ request);
       // setTimeOutFunc();

}

function callAdRequest(eachRecord,i){
      adios(eachRecord,i);
      auditude(eachRecord,i);
      request =i;
      console.log("iteration number "+i);
}

function waitforme(ms)  {
    return new Promise( resolve => {
     setTimeout(()=> {resolve('')} ,ms );
 })}



function adios(record,requestIndex){
    if (record==null) return
    let adiosDomain = "http://ad.primetime.adobe.com"
    let adiosURL = adiosDomain + record;
    getXMLResponse(adiosURL,requestIndex,adiosDomain,record);
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
        //console.log(url,requestIndex);
        if (x.readyState == 4 && x.status == 200){
            //console.log("in "+url,requestIndex);
            let doc = x.responseXML;
            x = doc.documentElement.childNodes;
            var txt,adDetails,j=0;
            for (i = 0; i < x.length ;i++) {
                txt = x[i].nodeName; 
                if (txt == "Body"){
                      
                    //console.log("in "+url,requestIndex); 
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
                                        //console.log(requestIndex," Ad Found auditude", domain);
                                        AdFoundArrAuditude.push(record+" "+adSystem+" "+redirectURL);
                                       // AdFoundArrAuditude.push(record);
                                      //  AdFoundArrAuditude.push(adSystem);
                                      //  AdFoundArrAuditude.push(redirectURL);
                                    }
                                    if(domain=="http://ad.primetime.adobe.com"){
                                        //console.log(requestIndex," Ad Found adios", domain);
                                        AdFoundArrAdios.push(record+" "+adSystem+" "+redirectURL);
                                        //if(requestIndex === (parseInt(totalCalls)-1)   
                                    }    
                                    //console.log(adID,adSystem,redirectURL);
                                    //console.log(requestIndex,"Ad Found");
                                }
                                else {
                                    //console.log(requestIndex,"No Ad Found", domain);
                                   // console.log(url);
                                //console.log(i);
                                }
                            }
                            else {
                               // console.log(requestIndex,"No Lot Found",domain);
                                //console.log(url);
                               // NoAdAuditude.push(url);
                            }
                        }
                        else {
                            //console.log(requestIndex,"No Pod Found ",domain);
                            //console.log(url);
                           // NoPodAuditude.push(url);

                        }  
                        if(requestIndex === (parseInt(totalCalls)-1) && domain=="http://ad.primetime.adobe.com"){setTimeOutFunc();}              
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

setTimeOutFunc = () => {
    setTimeout(function(){
        AdFoundArrAdios = AdFoundArrAdios.sort();
        AdFoundArrAuditude = AdFoundArrAuditude.sort();
        diffValue = AdFoundArrAuditude.length - AdFoundArrAdios.length;
        console.log("Difference is - "+diffValue+" out of Total "+request+1+" request");
    
        let difference = AdFoundArrAuditude
                     .filter(x => !AdFoundArrAdios.includes(x))
                     .concat(AdFoundArrAdios.filter(x => !AdFoundArrAuditude.includes(x)));
        //console.log(difference);
        generateCSV(difference);
        //generateCSV(NoAdAuditude);
    },1000)
}

function generateCSV(data){
    //document.querySelector("#data").append(data)
    var CsvString = "";
    data.forEach(function(RowItem, RowIndex) {
        CsvString += RowItem + ',';
        CsvString += "\r\n";
        //hyperlink = "http://ad.primetime.adobe.com"+CsvString;
        //document.querySelector("#data").append(hyperlink);
    });
    
    
    //CsvString = "data:application/csv," + encodeURIComponent(hyperlink);
    CsvString = "data:application/octetstream," + encodeURIComponent(CsvString);
    

    var x = document.createElement("A");
    x.setAttribute("href", CsvString );
    x.setAttribute("download","ABDiffResult"+Math.random()+".xls");
    document.body.appendChild(x);
    x.click()
}

//data:text/plain;charset=utf-8