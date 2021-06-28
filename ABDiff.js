console.log("Start");

//Using Promise Fetch API to read file 
function asynCalltoFile(file){
        fetch(file).then((response)=>{
            return response.text();
        }).then((text)=>{
            getData(text);
        })
}

asynCalltoFile("<file_name_with_each_request_in_new_line>");

function getData(data){
   let splitNewLine = data.split('\n'),eachRecord;
   let noOfLines = splitNewLine.length;
    console.log(noOfLines)
    for(let i=0;i<noOfLines;i++){
        eachRecord = splitNewLine[i].match(/(?<=GET\s+).*?(?=\s+HTTP)/gs); //Regex to filter AD request from file
        auditude(eachRecord);
        adios(eachRecord);
    }
}

function auditude(record){
    if(record!=null){
        let audDomain = "<Auditude_Domain>" //Domain_not_Checkin to GIT
        let auditudeURL = audDomain + record;
        getXMLResponse(auditudeURL);
    }
    

}

function adios(record){
    if (record!=null){
        let adiosDomin = "<Adios_Domain>" //Domain_not_Checkin to GIT
        let adiosURL = adiosDomin + record;
        getXMLResponse(adiosURL);
    }
   
}

//Parsing XML Response
function getXMLResponse(url){
        var x = new XMLHttpRequest();
        x.open("GET", url, true);
        x.onreadystatechange = function () {
        if (x.readyState == 4 && x.status == 200)
            {
        var doc = x.responseXML;
        console.log(doc);
        // …
        }
    };
    x.send(null);
    
}

