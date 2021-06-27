

//SetTimeout Example

//Output - Start --> End --> CallBack
let time = 3000;
console.log("Start before setTimeout");
setTimeout(function(){
    console.log("CallBack after "+time+ "ms");
},time);
console.log("End after setTimeout");


//setTimeOutInLoop
//Output - etTimeOutInLoop - Start before setTimeout 
//--> setTimeOutInLoop - End after setTimeout 
//--> 6 TimessetTimeOutInLoop - CallBack after 6000ms because i value is 6 by the the settimeout comes to call stack

console.log("setTimeOutInLoop - Start before setTimeout");
function setTimeOutInLoop(n){
     for(var i=0;i<=n;i++){
        setTimeout(function(){
            console.log("setTimeOutInLoop - CallBack after "+i*1000+ "ms");
        },i*1000);
     }
}
console.log("setTimeOutInLoop - End after setTimeout");

setTimeOutInLoop(5);