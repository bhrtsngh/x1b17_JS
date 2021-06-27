console.log("Start EventPropagation");

document.querySelector("#grandParent")
    .addEventListener("click",function(e){
        console.log("GrandParent  clicked");
        e.stopPropagation();
},false);

document.querySelector("#parent")
    .addEventListener("click",function(e){
      // e.stopPropagation();
        console.log("Parent clicked");
    },false)

document.querySelector("#child")
    .addEventListener("click",function(e){
       //e.stopImmediatePropagation();
        console.log("Child clicked");
    },false)    

    document.querySelector("body")
    .addEventListener("click",function(){
       // event.stopImmediatePropagation();
        console.log("body clicked");
    })   

 function Anonymous(){
     console.log("Anonymous  Function");
 }   