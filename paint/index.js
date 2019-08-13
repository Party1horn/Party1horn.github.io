window.onload = init;

let canvas, ctx, btnSave, btnClear, inputColor, inputSize, outputSize;

let mouse = {x: 0, y: 0, drawing: false};

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    btnSave = document.getElementById("btnSave");
    btnClear = document.getElementById("btnClear");
    inputSize = document.getElementById("inputSize");
    outputSize = document.getElementById("outputSize");
    inputColor = document.getElementById("inputColor");

    window.onresize = recalcSize;

    btnSave.onclick = save;

    inputSize.oninput = ()=>{ 
        ctx.lineWidth = inputSize.value; 
        ctx.lineJoin = 'round'; 
        ctx.lineCap = 'round';
        outputSize.value = inputSize.value;
    };
    outputSize.onchange = ()=>{
        inputSize.value = outputSize.value;
        ctx.lineWidth = inputSize.value; 
        ctx.lineJoin = 'round'; 
        ctx.lineCap = 'round';
    };
    inputColor.onchange = ()=>{ ctx.strokeStyle = inputColor.value; };

    // Ruft recalcSize einmal auf, sobald Rendering bereit
    requestAnimationFrame(recalcSize);

    btnClear.onclick = clearCanvas;
    
    function recalcSize() {
        let r = canvas.getBoundingClientRect();
        canvas.width = r.width;
        canvas.height = r.height;
        ctx.strokeStyle = inputColor.value;
        ctx.lineWidth = inputSize.value;
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
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }

    function clearCanvas() {
        ctx.clearRect(0,0,canvas.width, canvas.height);
    }

    canvas.onmousedown = (e) => { mouse.drawing = true; ctx.beginPath(); };
    window.onmouseup = () => { mouse.drawing = false; };
    window.addEventListener("touchstart", (e) => { e.preventDefault(); updateTouchPos(e); ctx.moveTo(mouse.x, mouse.y); ctx.beginPath(); mouse.drawing = true; }, {passive: false});
    window.addEventListener("touchend", () => { mouse.drawing = false; }); 

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