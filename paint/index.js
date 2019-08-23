window.onload = init;

let canvas, ctx, btnSave, btnClear, inputColor, inputBGColor, inputSize, outputSize;

let mouse = {x: 0, y: 0, drawing: false};

const view = {
    zoom: 1,
    cursorSize: 10
}

let doc = {paths: []};
let verlauf = [];
let activePath = [];

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    btnSave = document.getElementById("btnSave");
    btnUndo = document.getElementById("btnUndo");
    btnClear = document.getElementById("btnClear");
    //inputSize = document.getElementById("inputSize");
    outputSize = document.getElementById("outputSize");
    inputColor = document.getElementById("inputColor");
    inputBGColor = document.getElementById("inputBGColor");

    btnUndo.addEventListener("click", (e)=>{
        undo();
    });

    outputSize.value = view.cursorSize;
    inputBGColor.value = "#ffffff";

    window.onresize = recalcSize;
    window.onorientationchange = ()=>{requestAnimationFrame(recalcSize);};

    btnSave.onclick = save;

    /*inputSize.oninput = ()=>{ 
        ctx.lineWidth = inputSize.value; 
        ctx.lineJoin = 'round'; 
        ctx.lineCap = 'round';
        outputSize.value = inputSize.value;
    };*/
    outputSize.onchange = ()=>{
        //inputSize.value = outputSize.value;
        view.cursorSize = Number.parseFloat(outputSize.value);
        ctx.lineWidth = view.cursorSize; 
        ctx.lineJoin = 'round'; 
        ctx.lineCap = 'round';
    };
    inputColor.onchange = ()=>{ ctx.strokeStyle = inputColor.value; };
    inputBGColor.onchange = ()=>{ canvas.style.backgroundColor = inputBGColor.value; };

    // Ruft recalcSize einmal auf, sobald Rendering bereit
    requestAnimationFrame(recalcSize);

    btnClear.onclick = clearDocument;

    
    function recalcSize() {
        let r = canvas.getBoundingClientRect();
        canvas.width = r.width;
        canvas.height = r.height;
        ctx.strokeStyle = inputColor.value;
        ctx.lineWidth = view.cursorSize;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }

    window.onmousemove = (e) => {
        let r = canvas.getBoundingClientRect();
        mouse.x = e.pageX - r.left;
        mouse.y = e.pageY - r.top;
        updateMouse();
    };
    window.addEventListener("touchmove", (e)=>{ e.preventDefault(); updateTouchPos(e); updateMouse(); }, {passive: false});
    function updateTouchPos(e){
        let r = canvas.getBoundingClientRect();
        let t = e.touches[0];
        mouse.x = t.pageX - r.left;
        mouse.y = t.pageY - r.top;
    }

    function updateMouse() {
        if(mouse.drawing) {
            activePath.push([mouse.x,mouse.y]);
        }
    }

    function clearDocument() {
        doc.paths = [];
        verlauf = [];
    }

    canvas.onmousedown = (e) => { mouse.drawing = true; };
    window.onmouseup = () => { mouse.drawing = false; strokeEnd(); };
    canvas.addEventListener("touchstart", (e) => { e.preventDefault(); updateTouchPos(e); ctx.moveTo(mouse.x, mouse.y); mouse.drawing = true; }, {passive: false});
    window.addEventListener("touchend", () => { mouse.drawing = false; strokeEnd(); }); 

    function draw(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        for(let p of doc.paths) drawPath(p[0],p[1],p[2]);
        if(activePath.length > 1) drawPath(activePath, view.cursorSize, inputColor.value);
    }

    function drawLoop(){
        draw();
        requestAnimationFrame(drawLoop);
    }
    requestAnimationFrame(drawLoop);

    function drawPath(path,lw,color){
        ctx.lineWidth = lw; 
        ctx.strokeStyle = color;
        ctx.lineJoin = 'round'; 
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(path[0][0]*view.zoom,path[0][1]*view.zoom);
        for(let p of path) ctx.lineTo(p[0] * view.zoom,p[1] * view.zoom);
        ctx.stroke();
        ctx.closePath();
    }

    function strokeEnd(){
        if(activePath.length <= 1) return;
        let id = doc.paths.push([activePath,view.cursorSize,inputColor.value]) - 1;
        verlauf.push({
            action: "addPath",
            pathid: id
        });
        activePath = [];
    }

    function undo(){
        let ac = verlauf.pop();
        switch(ac.action) {
            case "addPath":
                doc.paths.splice(ac.pathid, 1);
                break;
        }
    }

    function save(){
        let url = canvas.toDataURL("image/png");
        let a = document.createElement("a");
        a.href = url;
        a.download = "image.png";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

}