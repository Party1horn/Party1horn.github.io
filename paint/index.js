window.onload = init;

let canvas, ctx, btnSave, btnClear, inputColor, inputBGColor, inputSize, outputSize;

let mouse = {x: 0, y: 0, drawing: false};

const View = {
    zoom: 1,
    viewX: 0,
    viewY: 0,

    viewWidth: 1,
    viewHeight: 1,
    cursorSize: 10,

    performZoom(pXm, pYm, newZoom){
        if(newZoom <= .2) newZoom = 0.2;
        let pXv = pXm / View.zoom - View.viewX;
        let pYv = pYm / View.zoom - View.viewY;

        let viewXn = pXm / newZoom - pXm / View.zoom + View.viewX;
        let viewYn = pYm / newZoom - pYm / View.zoom + View.viewY;

        View.viewX = viewXn;
        View.viewY = viewYn;
        View.zoom = newZoom;
        View.updateBackground();
    },

    draw(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        View.drawBackground();
        for(let p of doc.paths) View.drawPath(p[0],p[1],p[2]);
        if(DrawManager.activePath.length > 1) View.drawPath(DrawManager.activePath, View.cursorSize, inputColor.value);
    },

    updateBackground(){
        canvas.style.setProperty('--square-size', (40 * View.zoom)+"px");
        canvas.style.setProperty('--square-x', (View.viewX / View.zoom)+"px");
        canvas.style.setProperty('--square-y', (View.viewY / View.zoom)+"px");
    },

    drawBackground(){
        ctx.lineWidth = 1;
        ctx.strokeStyle = "grey";
        let zoom = View.zoom;
        let squareSize = 40;

        let skipX = -View.viewX / squareSize;
        let x = Math.floor(skipX) * squareSize;
        while(true){
            let mx = (x + View.viewX) * zoom;
            if(mx > View.viewWidth) break;

            ctx.beginPath();
            ctx.moveTo(mx,0);
            ctx.lineTo(mx,View.viewHeight);
            ctx.stroke();
            ctx.closePath();
            x += squareSize;
        }

        let skipY = -View.viewY / squareSize;
        let y = Math.floor(skipY) * squareSize;
        while(true){
            let my = (y + View.viewY) * zoom;
            if(my > View.viewHeight) break;

            ctx.beginPath();
            ctx.moveTo(0, my);
            ctx.lineTo(View.viewWidth, my);
            ctx.stroke();
            ctx.closePath();
            y += squareSize;
        }
    },

    drawPath(path,lw,color){
        ctx.lineWidth = lw * View.zoom; 
        ctx.strokeStyle = color;
        ctx.lineJoin = 'round'; 
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo((View.viewX + path[0][0])*View.zoom, (View.viewY + path[0][1])*View.zoom);
        for(let p of path) ctx.lineTo((View.viewX + p[0]) * View.zoom, (View.viewY + p[1]) * View.zoom);
        ctx.stroke();
        ctx.closePath();
    }
}

let doc = {paths: [],backgroundColor:"#ffffff"};
let verlauf = [];

const TouchManager = {

    isGesture: false,
    prevTouches: [],

    init(){
        canvas.addEventListener("touchstart", TouchManager.onTouchStart, {passive: false});
        window.addEventListener("touchmove", TouchManager.onTouchMove);
        window.addEventListener("touchcancel", TouchManager.onTouchEnd);
        window.addEventListener("touchend", TouchManager.onTouchEnd);
    },

    onTouchStart(e){
        if(e.touches.length == 1){
            TouchManager.isGesture = false;
            DrawManager.startDraw();
        } else {
            TouchManager.isGesture = true;
            if(mouse.drawing){
                mouse.drawing = false;
                DrawManager.cancelDraw();
            }
        }
        e.preventDefault();
    },

    onTouchMove(e){
        if(TouchManager.isGesture){
            if(e.touches.length == 2) {
                let t1 = e.touches[0];
                let t2 = e.touches[1];
                let d1 = TouchManager.getPrevTouch(t1);
                let d2 = TouchManager.getPrevTouch(t2);
                if(d1 && d2) {
                    let newDist = TouchManager.getTouchDistance(t1, t2);
                    let oldDist = TouchManager.getTouchDistance(d1, d2);
                    let diff = newDist - oldDist;

                    let cX = (t1.pageX + t2.pageX) / 2;
                    let cY = (t1.pageY + t2.pageY) / 2;
                    View.performZoom(cX,cY,View.zoom + (diff * 0.00001) * View.zoom);
                }

                if(d1) {
                    let diffX = t1.pageX - d1.pageX;
                    let diffY = t1.pageY - d1.pageY;
                    View.viewX += diffX / View.zoom;
                    View.viewY += diffY / View.zoom;
                }
            }
        } else {
            if(mouse.drawing) DrawManager.activePath.push([mouse.x / View.zoom - View.viewX, mouse.y / View.zoom - View.viewY]);
        }
        TouchManager.prevTouches = e.touches;
    },

    onTouchEnd(e){
        if(TouchManager.isGesture){
            
        } else {
            mouse.drawing = false;
            DrawManager.stopDraw();
        }

    },

    calcTouchMovement(touch){
        let id = touch.identifier;
        for(let t of TouchManager.prevTouches){
            if(t.identifier == id) return [t.pageX - touch.pageX, t.pageY - touch.pageY];
        }
        return [0,0];
    },
    getPrevTouch(touch){
        let id = touch.identifier;
        for(let t of TouchManager.prevTouches){
            if(t.identifier == id) return t;
        }
        return null;
    },
    getTouchDistance(touch1, touch2){
        let dx = touch1.pageX - touch2.pageX;
        let dy = touch1.pageY - touch2.pageY;
        return dx * dx + dy * dy;
    }

};

const DrawManager = {

    activePath: [],

    startDraw(){

    },

    stopDraw(){
        if(DrawManager.activePath.length <= 1) return;
        let id = doc.paths.push([DrawManager.activePath,View.cursorSize,inputColor.value]) - 1;
        verlauf.push({
            action: "addPath",
            pathid: id
        });
        DrawManager.activePath = [];
    },

    cancelDraw(){
        DrawManager.activePath = [];
    }

};

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

    TouchManager.init();
    View.updateBackground();

    btnUndo.addEventListener("click", (e)=>{
        undo();
    });

    outputSize.value = View.cursorSize;
    inputBGColor.value = canvas.style.backgroundColor = "#ffffff";

    window.onresize = recalcSize;
    btnSave.onclick = save;
    window.onorientationchange = ()=>{requestAnimationFrame(recalcSize);};
    outputSize.onchange = ()=>{
        View.cursorSize = Number.parseFloat(outputSize.value);
        ctx.lineWidth = View.cursorSize; 
        ctx.lineJoin = 'round'; 
        ctx.lineCap = 'round';
    };
    inputColor.onchange = ()=>{ ctx.strokeStyle = inputColor.value; };
    inputBGColor.onchange = ()=>{ setBackgroundColor(inputBGColor.value); };
    // Ruft recalcSize einmal auf, sobald Rendering bereit
    requestAnimationFrame(recalcSize);

    btnClear.onclick = clearDocument;

    
    function recalcSize() {
        let r = canvas.getBoundingClientRect();
        canvas.width = View.viewWidth = r.width;
        canvas.height = View.viewHeight = r.height;
        ctx.strokeStyle = inputColor.value;
        ctx.lineWidth = View.cursorSize;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }

    window.onmousemove = (e) => {
        let r = canvas.getBoundingClientRect();
        mouse.x = e.pageX - r.left;
        mouse.y = e.pageY - r.top;
        updateMouse();
    };
    function updateTouchPos(e){
        let r = canvas.getBoundingClientRect();
        let t = e.touches[0];
        mouse.x = t.pageX - r.left;
        mouse.y = t.pageY - r.top;
    }

    function updateMouse() {
        
    }

    function clearDocument() {
        doc.paths = [];
        verlauf = [];
    }

    canvas.onmousedown = (e) => { mouse.drawing = true; };
    window.onmouseup = () => { mouse.drawing = false; DrawManager.stopDraw(); };
    canvas.addEventListener("touchstart", (e) => { e.preventDefault(); updateTouchPos(e); mouse.drawing = true; }, {passive: false});
    canvas.addEventListener("touchmove", (e)=>{ e.preventDefault(); updateTouchPos(e); updateMouse(); }, {passive: false});
    canvas.addEventListener("touchend", () => { 
        mouse.drawing = false;
        
    }); 

    function drawLoop(){
        View.draw();
        requestAnimationFrame(drawLoop);
    }
    requestAnimationFrame(drawLoop);

    function undo(){
        let ac = verlauf.pop();
        if(!ac) return;
        switch(ac.action) {
            case "addPath":
                doc.paths.splice(ac.pathid, 1);
                break;

            case "changeBackground":
                setBackgroundColor(ac.prevvalue, true);
                break;
        }
    }

    function setBackgroundColor(color, isUndo){
        if(!isUndo) verlauf.push({
            action: "changeBackground",
            prevvalue: doc.backgroundColor,
            value: color
        });
        doc.backgroundColor = color;
        canvas.style.backgroundColor = color;
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