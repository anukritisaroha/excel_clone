//this js works for the function on excel such as color change alignment etc
let allAlignmentOptions = document.querySelectorAll(".align-cell-content span");

let leftAlign = allAlignmentOptions[0];
let centerAlign = allAlignmentOptions[1];
let rightAlign = allAlignmentOptions[2];

leftAlign.addEventListener("click", function () {
  if (lastcell) {
    lastcell.style.textAlign = "left";
    let address = lastcell.getAttribute("data-address");
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
