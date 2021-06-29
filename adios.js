console.log("Start");
let AdFoundArrAdios = [];

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

function getData(data){
   let splitNewLine = data.split('\n'),eachRecord;
   let noOfLines = splitNewLine.length;
    //console.log(noOfLines)
    let i =0,x=[];
    for(let i=0;i<10000;i++){
        eachRecord = splitNewLine[i].match(/(?<=GET\s+).*?(?=\s+HTTP)/gs);
        auditude(eachRecord,i);
    }
    
}

setTimeout(function(){
    console.log(AdFoundArrAdios);
},700000)

function auditude(record,requestIndex){
    if(record!=null){
        let audDomain = "http://ad.primetime.adobe.com"
        let auditudeURL = audDomain + record;
        getXMLResponse(auditudeURL,requestIndex);
    }
}

 function getXMLResponse(url,requestIndex){
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
                                    adID = adDetails.getAttribute("id");
                                    AdFoundArrAdios.push(url+" "+adID+" "+adSystem+" "+redirectURL);
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


//console.log(AdFoundArr.length);