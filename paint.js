window.onload = function (){
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var painting = document.getElementById("content");
    var paintStyle = getComputedStyle(painting);
    canvas.width = parseInt(paintStyle.getPropertyValue("width"));
    canvas.height = parseInt(paintStyle.getPropertyValue("height"));

    let inputColor = document.getElementById("inputColor");
    let inputSize = document.getElementById("inputSize");

    inputColor.onchange = function(e) {
        console.log("Test1");
        ctx.strokeStyle = inputColor.value;
    };

    console.log(inputColor);

    inputSize.onchange = function(e) {
        console.log("Test2");
        ctx.lineWidth = inputSize.value;
    };

    var mouse = {x: 0, y: 0};

    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    }, false);

    canvas.addEventListener('touchmove', (e)=>{
        console.log("touchmove");
        let t = e.touches[0];
        mouse.x = t.pageX - e.target.getElementBoundingRect().left;
        mouse.y = t.pageY - e.target.getElementBoundingRect().top;
    }, {passive: false});

    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#FF0000';

    canvas.addEventListener('mousedown', function(e) {
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        canvas.addEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('touchstart', (e)=>{
        let t = e.touches[0];
        mouse.x = t.pageX - e.target.getElementBoundingRect().left;
        mouse.y = t.pageY - e.target.getElementBoundingRect().top;

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