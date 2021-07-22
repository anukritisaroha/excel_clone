let rownosection=document.querySelector(".row-no-section")
let lastcell;
//we have this to show selected cell cell address
let formulasection=document.querySelector(".selected-cell")

//in cell selectn scroll work that cells scroll corresponding to column 
let cellsectn=document.querySelector(".cell-section");
let coltag=document.querySelector(".column-tag")

//we create this to handle formula ans updation

let dataobj = {};

//work for formula bar input
let formulainput=document.querySelector(".formula-input-section");
formulainput.addEventListener("keypress",function(e){
    if(e.key=="Enter"){
        //tbhi value eval show krni hai 
        //or input formula nikal lo jisse ki hum fir usko currcell me update kra ske
        typedformulaininput=e.currentTarget.value
         
        //agr cell select nhi ki return mardo
        if(!lastcell) return;

        let selectedcelladd=lastcell.getAttribute("data-address");
        let cellobj=dataobj[selectedcelladd];//cell obj me hme par. ka value up f down sb mil jaega
        //1.ab iss obj ka formula chnge krna hai new formula dalna hai
        cellobj.formula=typedformulaininput;
        //2.upstream ke cells pr jakr khud ko htana
        let upstream=cellobj.upstream;
        for(let i=0;i<upstream.length;i++){
            removefromdownstream(upstream[i],selectedcelladd);//upstream me jo cell hai usme se mujhe selected cell ko htado 
        }
        //3.upstream khali kr dena 
        cellobj.upstream=[];
        //4.ab upstream me new value dalo new formula ke acc
        let formulaarr=typedformulaininput.split(" ");//gives us a array without spacing
        let cellsinformula=[];

        for(let i=0;i<formulaarr.length;i++){
            //if ye sb ho toh ignore kro bs values chaiye upstream me
            if(
                formulaarr[i] != "+" &&
                formulaarr[i] != "-" &&
                formulaarr[i] != "*" &&
                formulaarr[i] != "/" &&
                //not a no also
                isNaN(formulaarr[i])
                            
            ){
                cellsinformula.push(formulaarr[i]);
            }
        }
        //ab connection bnane ke liye new upstream ki downstream me child add krao
        for(let i=0;i<cellsinformula.length;i++){
            addtodownstream(cellsinformula[i],selectedcelladd);
        }
        //ab upstream me add krado new data 
        cellobj.upstream=cellsinformula;

        //5.value eval kro acc to new formula or update kro val
        let valobj={};
        for(let i=0;i<cellsinformula.length;i++){
            let cellvalue=dataobj[cellsinformula[i]].value;
            valobj[cellsinformula]=cellvalue;//value of new upstream store in valobj coress to cell address
        }
        for(let key in valobj){
            typedformulaininput=typedformulaininput.replace(key,valobj[key]);
        }
        let newval=eval(typedformulaininput);
        //show this on ui
        lastcell.innerText=newval;
        cellobj.value=newval;

        //6.value update ke baad sare downstream me jakr unko bhi update krdo
        let downsteam=cellobj.downstream;
        for(let k=0;k<downsteam.length;k++){
            //this update cell functn do certain operations
            updatecell(downsteam[k]);
        }
        dataobj[selectedcelladd]=cellobj;//at last curr cell ka obj update krdo main global data obj me
        formulainput.value="";
    }
});

cellsectn.addEventListener("scroll",function(e){
    //e.currentTarget.scrollLeft is property of scroll tht if we scroll left from click cell
    a=e.currentTarget.scrollLeft; //scroll left gives distance in px how mch cell section has move to left so that we can move col also that mch in r to l directn
    //transform -ve so that scroll right to left of colomn tag also corresponding to cell section
    coltag.style.transform=`translateX(-${a}px)`
    
    //for moment of row with cell section use scroll top if we scroll top to bottom row mst move bottom to up so use - for b to t direction of row when scroll down we have use this so that colomn and row scroll work independently
    a=e.currentTarget.scrollTop;
    rownosection.style.transform=`translateY(-${a}px)`
})




//making row on ui
for(let i=1;i<=100;i++){
    let div=document.createElement("div")
    div.innerText=i;
    //to add styling to row no done in css
    div.classList.add("row-number")
    rownosection.append(div)
}
//let coltag=document.querySelector(".column-tag")

for(let i=0;i<26;i++){
    let asciicode=65+i;
    let reqalpha=String.fromCharCode(asciicode);
    let div=document.createElement("div")
    div.innerText=reqalpha;
    //do styling in css of column on every i
    div.classList.add("column")
    coltag.append(div);
}
//work for making grid declare globally
// let cellsectn=document.querySelector(".cell-section");

//here we r making each cell ui +their cell obj to apply formula

for(let i=1;i<=100;i++){    // dryrun i=1
    let rowdiv=document.createElement("div")
    //do css styling of row
    rowdiv.classList.add("row") //i=1 j  iteration[A1,B1...]

    for(let j=0;j<26;j++){  //j=0
        let asciicode=65+j;   //A
        let reqalpha=String.fromCharCode(asciicode)
        let celladress=reqalpha+i;  //A1....Z1
        
        //create obj here so that for every cell we could get value,for,up,down corres to celladdress
        dataobj[celladress]= {
            value: undefined,
            formula: undefined,
            upstream :[],
            downstream:[],
            align:"left",
            color:"black",
            bgColor:"white",
           
        };
        
        let celldiv=document.createElement("div")

        //now we will handle case when we update value in grid how data obj must change
       celldiv.addEventListener("input",function(e){
           //jispr click kia uska cell address le aao
           let currcelladdress=e.currentTarget.getAttribute("data-address")
           //ab hme ye celladdress as key use krenge to get the dataobj value corres to celladress jisse hum value jo ek obj hai usko update kr ske uska for,up,down sb to cell address yha fetch krna pda 
           //kyoki dataobj ki yha jrurt thi
           let currcellobj=dataobj[currcelladdress];

            //1.currcellobj me ab value vale me value update krado
           currcellobj.value=e.currentTarget.innerText;
           //2.update formula also in obj
           currcellobj.formula=undefined;//bcz in grid we have no formula calculatn we cal formula in formula bar sectn
           //3.upstream loop
           //suppart1.loop on upstream
           //2.for each cell uske downst me jao khud ko remove kro
           //3.up ko empty krdo
          let currupstream=currcellobj.upstream;
          for(let k=0;k<currupstream.length;k++){
              //remove from downstream(parent,child) of parent the child //its a functn
              removefromdownstream(currupstream[k],currcelladdress);//c1=[A1,B1] so remove c1 from a1 and b1 downstream
          }
          currcellobj.upstream=[];

          //4.downstream me khud ki value update krani apne child me jo downstream me pde hai
          let currdownsteam=currcellobj.downstream;
          for(let k=0;k<currdownsteam.length;k++){
              //this update cell functn do certain operations
              updatecell(currdownsteam[k]);
          }
         
            //after all work currcell ka kaam ho gya sb ab usko dataobj me save kralo 
            //modificatn se phle fetch kia tha let currcellobj=dataobj[currcelladdress];
            //ab modify ke baad vapas daldo curcellobj me vo values thi jo update hui thi jaise val,for,all
            dataobj[currcelladdress]=currcellobj;
            


       })

        celldiv.contentEditable=true
        //do css styling of cell
        celldiv.classList.add("cell");   //add cell to div
        celldiv.setAttribute("data-address",celladress)  //cell me address bhi set kr dia A1
        
        //to highlight selected cell
        celldiv.addEventListener("click",function(e){
            if(lastcell){
                //cell selected made in css styling
                lastcell.classList.remove("cell-selected");
            }
            e.currentTarget.classList.add("cell-selected");

            //then add e.current target to last cell to remove prev in loop
            lastcell=e.currentTarget;
            //to show cell address at side of formula bar
            let currselectedcelladd=e.currentTarget.getAttribute("data-address")
            formulasection.innerText=currselectedcelladd;
        })

        rowdiv.append(celldiv) //row me dal dia ab cell bhi or address bhi
    }
    cellsectn.append(rowdiv);//finally put rowdiv into cell section on ui
}
// //fake data to test grid input we get correct evaluated formula of par. cell  input here
// dataobj["A1"].value=20;
// dataobj["A1"].downstream=["B1"];
// dataobj["B1"].formula="2*A1";
// dataobj["B1"].upstream=["A1"];
// dataobj["B1"].value= 40;

// let a1cell=document.querySelector("[data-address='A1']");
// let b1cell=document.querySelector("[data-address='B1']");
// a1cell.innerText=20;
// b1cell.innerText=40;

//function creation
function removefromdownstream(parentcell,childcell){
    //1.fetch parent downstream from data obj
    let parentcelldownstream=dataobj[parentcell].downstream;
    //2.filter the correct childcell from parent downstream not to be removed
    let filtereddownstream=[];//isme vo value rhegi jinko hme nhi htana
    for(let i=0;i<parentcelldownstream.length;i++){
        if(parentcelldownstream[i]!=childcell){
          filtereddownstream.push(parentcelldownstream[i]);
        }

    }
    //3.save filtered downstream of parent to data obj isme jo childcell ki jrurt nhi vo ht jaenge 
    dataobj[parentcell].downstream=filtereddownstream;
}


//functn update
function updatecell(cell){//cell has tht cell which needs to be updated
    //1.to update cell of downstream we go to that child cell and first get value of parent to be updated from upstream
    let cellobj=dataobj[cell];
    let upstream=cellobj.upstream;

    //find formula for the downstream child cell whose value we have to evaluate
    let formula=cellobj.formula;

    //ab upstream me jo bhi cells hai unka obj bnaunga key value ki pair me jisse mujhe coress cell address ki value mil jae or m formula me rkh lu
    let valobj={};

    for(let i=0;i<upstream.length;i++){
        //dataobj se value laungi
        let cellvalue=dataobj[upstream[i]].value;
        //store kraungi obj me as key upstream hold cell address and cell value hold value of key
        valobj[upstream[i]]=cellvalue;

       //now use value in formula// of child formula in string form use replace function
       for(let x in valobj){// x has key of obj ie a cell adress 
          //fir ye formula me daldo jisse agli baar koi updation ho toh shi se work kre
          formula=formula.replace(x,valobj[x]);//coress cell adress jo nai value thi parent ki vo valob me hai toh simply uss cell adree pr new value daldi 
          
          //till here we get parent updated value and changes has been done in downstream cell formula sectn 
          
          //finally eval that formula in grid only
          let newval=eval(formula);
          
          //the formula eval value saved in dataobj but to show on ui
          let cellonui=document.querySelector(`[data-address='${cell}']`)
          cellonui.innerText=newval;

         //new val update krani hai data obj me finally kyoki ye nxt time use hogi may be for other cell 
         dataobj[cell].value=newval;


         //ab child formula evaluate ho gya dataobj me value bhi aa gyi updated
         //pr uskka jo downstream hoga unko bhi update krado kyoki ab value chnge hai
         let downstream=cellobj.downstream;
         for(let i=0;i<downstream.length;i++){
            updatecell(downstream[i]);
         }
       }
      


    }
}
//function addtodownstream to made connection of new upstream elements and child
function addtodownstream(parent,child){
    dataobj[parent].downstream.push(child);
}