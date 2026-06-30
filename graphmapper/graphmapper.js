body = document.getElementById("Body");
canvas = document.getElementById("Screen");

ctx = canvas.getContext("2d");
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

document.body.style.cursor = 'none';

class Controller {
    constructor() {
        this.w = 0;
        this.a = 0;
        this.s = 0;
        this.d = 0;
    }
};

//document.title = "Hello, World!";

var scrollX;
var scrollY;
var scrollSpeed = 5;
var mouseX;
var mouseY;
var zoom = 30;
var fps = 60;

var controller = new Controller;

setInterval(tick, 1000/fps);

function tick(){
    //scrollX = 7;
    //scrollY = 10;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    scrollX += ((controller.a - controller.d) * scrollSpeed);
    scrollY += ((controller.w - controller.s) * scrollSpeed);
    updateInputs();
    drawGridlines();
    drawVertFocus();
    drawMouse();
}

function drawVertFocus(){
    ctx.beginPath();
    let {x, y} = getMouseDisplayPos(mouseX, mouseY);
    ctx.arc(x, y, zoom / 4, 0, Math.PI * 2);
    ctx.fillStyle = "#000000";
    ctx.stroke();
    ctx.fillStyle = "#ff8800";
    ctx.fill(); 
}

function getMouseDisplayPos(x, y){
    return {
        x: Math.floor((x - (scrollX % zoom) + (zoom / 2)) / zoom) * zoom + (scrollX % zoom),
        y: Math.floor((y - (scrollY % zoom) + (zoom / 2)) / zoom) * zoom + (scrollY % zoom),
    }
}

function drawMouse(){
    ctx.lineWidth = 0.5;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(mouseX + 10.5, mouseY + 0.5);
    ctx.lineTo(mouseX - 10.5, mouseY + 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX + 0.5, mouseY + 10.5);
    ctx.lineTo(mouseX + 0.5, mouseY - 10.5);
    ctx.stroke();
}

document.addEventListener('keydown', function(event){
        var name = event.key;
        var code = event.code;
        if(name == "w"){
            controller.w = 1;
        }
        if(name == "a"){
            controller.a = 1;
        }
        if(name == "s"){
            controller.s = 1;
        }
        if(name == "d"){
            controller.d = 1;
        }
});
document.addEventListener('keyup', function(event){
        var name = event.key;
        var code = event.code;
        if(name == "w"){
            controller.w = 0;
        }
        if(name == "a"){
            controller.a = 0;
        }
        if(name == "s"){
            controller.s = 0;
        }
        if(name == "d"){
            controller.d = 0;
        }
});

function updateInputs(){
    
}

function drawGridlines(){
    ctx.lineWidth = 1;
    ctx.fillStyle = "#aaaaaa";
    for(let i = 0; i < window.innerWidth / zoom; i++){
        ctx.beginPath();
        ctx.moveTo((scrollX % zoom) + (i * zoom) + 0.5, 0);
        ctx.lineTo((scrollX % zoom) + (i * zoom) + 0.5, window.innerHeight);
        ctx.stroke();
    }
    for(let i = 0; i < window.innerHeight / zoom; i++){
        ctx.beginPath();
        ctx.moveTo(0, (scrollY % zoom) + (i * zoom) + 0.5);
        ctx.lineTo(window.innerWidth, (scrollY % zoom) + (i * zoom) + 0.5);
        ctx.stroke();
    }
    ctx.lineWidth = 3;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo((scrollX) + 0.5, 0);
    ctx.lineTo((scrollX) + 0.5, window.innerHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, (scrollY) + 0.5);
    ctx.lineTo(window.innerWidth, (scrollY) + 0.5);
    ctx.stroke();
}

function resizeCanvas(){
    canvas.style.width  = window.innerWidth;
    canvas.style.height = window.innerHeight;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

canvas.addEventListener("mousemove", function(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
});

