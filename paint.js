window.onload = function (){
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var painting = document.getElementById("content");
    var paintStyle = getComputedStyle(painting);
    canvas.width = parseInt(paintStyle.getPropertyValue("width"));
    canvas.height = parseInt(paintStyle.getPropertyValue("height"));

    let inputColor = document.getElementById("inputColor");
    let inputSize = document.getElementById("inputSize");
    let inputClear = document.getElementById("inputClear");

    inputClear.addEventListener("click", (e)=>{
        ctx.clearRect(0,0,canvas.width, canvas.height);
    });

    inputColor.onchange = function(e) {
        ctx.strokeStyle = inputColor.value;
    };

    inputSize.oninput = function(e) {
        ctx.lineWidth = inputSize.value;
    };

    var mouse = {x: 0, y: 0};

    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    }, false);

    canvas.addEventListener('touchmove', (e)=>{
        let t = e.touches[0];
        mouse.x = t.pageX - e.target.getBoundingClientRect().left;
        mouse.y = t.pageY - e.target.getBoundingClientRect().top;
        ctx.lineWidth = t.force * 10;
    }, {passive: false});

    ctx.lineWidth = inputSize.value;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = inputColor.value;

    canvas.addEventListener('mousedown', function(e) {
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        canvas.addEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('touchstart', (e)=>{
        let t = e.touches[0];
        mouse.x = t.pageX - e.target.getBoundingClientRect().left;
        mouse.y = t.pageY - e.target.getBoundingClientRect().top;

        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        canvas.addEventListener('touchmove', onPaint, false);
        e.preventDefault();
    });

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('touchend', (e)=>{
        canvas.removeEventListener('touchmove', onPaint, false);
    });

    var onPaint = function() {
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    };
}