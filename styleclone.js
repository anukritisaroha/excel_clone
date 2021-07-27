//this js works for the function on excel such as color change alignment etc
let allAlignmentOptions = document.querySelectorAll(".align-cell-content span");

let leftAlign = allAlignmentOptions[0];
let centerAlign = allAlignmentOptions[1];
let rightAlign = allAlignmentOptions[2];

leftAlign.addEventListener("click", function () {
  if (lastcell) {
    //to show only on ui text align helps to align or else not possible to align it is style function
    lastcell.style.textAlign= "left";
    //to save it in obj 
    let address = lastcell.getAttribute("data-address");
    //by default hmne left save kia tha pr ab change hone pr align me left right center aaenge
    dataobj[address].align = "left";
  }
});

rightAlign.addEventListener("click", function () {
  if (lastcell) {
    lastcell.style.textAlign = "right";
    let address = lastcell.getAttribute("data-address");
    dataobj[address].align = "right";
  }
});

centerAlign.addEventListener("click", function () {
  if (lastcell) {
    lastcell.style.textAlign = "center";
    let address = lastcell.getAttribute("data-address");
    dataobj[address].align = "center";
  }
});
//do same styling for bold itallic and all ki click kro bold ho jae vo chij ya underline etc
let allstyles=document.querySelectorAll(".bold-italics-underline span");
 let bold=allstyles[0];
 let italics=allstyles[1];
 let underline=allstyles[2];

 bold.addEventListener("click",function(){
   if(lastcell){
     //by using font weight here as function text becomes bold
     lastcell.style.fontWeight="bold";
     let address = lastcell.getAttribute("data-address");
     dataobj[address].bold = "bold";
   }
  
 });
 italics.addEventListener("click",function(){
  if(lastcell){
    //by using font style here as function text becomes italic if we set property italic of font style
    lastcell.style.fontStyle="italic";
    let address = lastcell.getAttribute("data-address");
    //italics obj is made in data obj in clone.js usme hi append kra lia updated filter
    dataobj[address].italics = "italic";
  }
});
underline.addEventListener("click",function(){
  if(lastcell){
    //text decoration in style provides us underline overline  property
    lastcell.style.textDecoration="underline overline";
    let address = lastcell.getAttribute("data-address");
    dataobj[address].underline = "underlined";
  }
});
//after bold itallic do work of font size and type
// let alltype=document.querySelectorAll(".font-type-size select")
// let type=alltype[0];
// let size=alltype[1];
// type.addEventListener("click",function(){
  //yha pr mujhe family add krni hai option me fir jb click kru to vo family meri last cell pr apply ho jae
// })


//then we do color work bg and normal color of text
let allcolors=document.querySelectorAll(".cell-color-options span");
let body=document.querySelector("body");
let bgcolorpicker=allcolors[0];
let fontcolorpicker=allcolors[1];
//first for bg color picker
bgcolorpicker.addEventListener("click",function(){
  //create some input tag  or us input tag ka type krdo khud se color
  let colorpicker=document.createElement("input");
  colorpicker.type="color";//any random color
  body.append(colorpicker);
  //jb click krenge vo random color aa jaega
  colorpicker.click();

  //ab mujhe ye selected random color as back color apni cell me dalna hai

  colorpicker.addEventListener("input",function(e){//e me aa jaega vo particular selected color of everytime set as bg color of selected cell
    if(lastcell){
      // style has bg property 
      lastcell.style.backgroundColor=e.currentTarget.value;
      //ab islo data obj me bhi save kralo
      let address = lastcell.getAttribute("data-address");
      dataobj[address].bgColor = e.currentTarget.value;
    }
    
  })
});

//same work for font color picker make color picker append in body and then appy listner ki color pr choose kro toh text color vaisa ho jae
fontcolorpicker.addEventListener("click",function(){
  let colorpicker=document.createElement("input");
  colorpicker.type="color";
  body.append(colorpicker);
  colorpicker.click();
  //till here we make color picker on body now use this in cell
  colorpicker.addEventListener("input",function(e){
    if(lastcell){
      lastcell.style.color=e.currentTarget.value;
      let address = lastcell.getAttribute("data-address");
      dataobj[address].color = e.currentTarget.value;
      
    }
  })
})
//ab mujhe save or clear krana hai file me
let fileoptions=document.querySelectorAll(".menubar div");
let filediv=fileoptions[0];
filediv.addEventListener("click",function(){
  //to close file menu if open
  let isOpen=filediv.getAttribute("data-open");
  if(isOpen=="true"){
    filediv.setAttribute("data-open","false");
    document.querySelector(".drop-down").remove();

  }
  else{
    //dropdown khol do agr bnd hai
    filediv.setAttribute("data-open","true");
  
    let dropdown=document.createElement("div");
    dropdown.innerHTML="<p>Save</p><p>Clear</p>";//p tag one for save another for clear

    //mujhe data save krana hai apna ab save krne pr
    let alloptions=dropdown.querySelectorAll("p");
    alloptions[0].addEventListener("click",function(){
      

     //dataobj me sara data hai vhi local storage me daal lo
     localStorage.setItem("sheet",JSON.stringify(dataobj));

    });
    //clear me local storage se sb htado
    alloptions[1].addEventListener("click",function(){
     localStorage.setItem("sheet","");
    });


    //ab mujhe class deni hai iss div ko jisse m styling kr sku
    dropdown.classList.add("drop-down");
    //append krado file options me hi
    filediv.append(dropdown);
  }
});
//clone.js me sb save kra lia jb refresh kre gayab na ho sheet ka data ui pr or save krne ke baad refresh krenge ya dobara kholenge sheet ko data vhi milega

