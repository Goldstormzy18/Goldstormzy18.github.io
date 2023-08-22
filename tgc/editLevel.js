
var fps = 30;
var displayScale = 4;
var speed = 4;

var contLayout = [false, false, false, false, false, false, false, false, false, false, false];

var xPos = 16;
var yPos = 9;

var camX = xPos * 16;
var camY = yPos * 16;

var facingX = 0;
var facingY = 0;

var display = document.getElementById("display");
var ctx = display.getContext("2d");
document.title = "The Great Conquest";

var map = new Image();
map.src = "mapViews/southernSlope.png";
var mapLayout = new Image();
mapLayout.src = "mapLayout/southernSlope.png";
var player = new Image();
player.src = "SamuelWalk.png";
display.crossOrigin = "anonymous";


display.width  = 256;
display.height = 192;

display.style.width  = (256 * displayScale).toString() + "px";
display.style.height = (192 * displayScale).toString() + "px";

var walkNum = 0;

ctx.fillStyle = "#000000";
initListeners();


ctx.drawImage(mapLayout,0,0,mapLayout.width, mapLayout.height);
var imageData = ctx.getImageData(0, 0, 40, 40);

setInterval(mainLoop, 1000/fps);

function mainLoop(){
    drawVoid();
    detectInputs();
    walk();

    drawPlayer();

}

function walk(){
    if(walkNum > 0){
        walkNum++;
        camX -= facingX * speed;
        camY -= facingY * speed;
        if(walkNum > 4){
            walkNum = 0;
            
            camX = xPos * 16;
            camY = yPos * 16;
        }
    }
}



function drawPlayer(){
    ctx.drawImage(player,0,0,16,32,120,80,16,32);

}

function startWalking(walkX, walkY){
    walkNum++;
    facingX = walkX;
    facingY = walkY;
    xPos -= walkX;
    yPos -= walkY;
    //camX -= walkX;
    //camY -= walkY;


}





function drawVoid(){
    ctx.fillRect(0,0,256,192);
    ctx.drawImage(mapLayout,0,0,mapLayout.width, mapLayout.height);
    ctx.drawImage(map, 0, 0, map.width, map.height, 120 - camX, 96 - camY, map.width, map.height)
}

function detectInputs(){
    if(walkNum == 0){
        if(contLayout[0]){
            startWalking(0, 1);
        }else if(contLayout[1]){
            startWalking(1, 0);
        }else if(contLayout[3]){
            startWalking(-1, 0);
        }else if(contLayout[2]){
            startWalking(0, -1);
        }else{
            //startWalking(0, 0);
        }
    }
}

function initListeners(){
    document.addEventListener('keydown', function(event){
        var name = event.key;
        var code = event.code;
        if(name == "ArrowUp"){
            contLayout[0] = true;
        }
        if(name == "ArrowLeft"){
            contLayout[1] = true;
        }
        if(name == "ArrowDown"){
            contLayout[2] = true;
        }
        if(name == "ArrowRight"){
            contLayout[3] = true;
        }
        if(name == "w"){
            contLayout[0] = true;
        }
        if(name == "a"){
            contLayout[1] = true;
        }
        if(name == "s"){
            contLayout[2] = true;
        }
        if(name == "d"){
            contLayout[3] = true;
        }
        if(name == " "){
            contLayout[4] = true;
        }
        if(name == "Shift"){
            contLayout[5] = true;
        }
        if(name == "z"){
            contLayout[6] = true;
        }
        if(name == "x"){
            contLayout[7] = true;
            xDown = true;
        }
        if(name == "q"){
            contLayout[10] = true;
        }
      }, false);
      document.addEventListener('keyup', function(event){
        var name = event.key;
        var code = event.code;
        if(name == "ArrowUp"){
            contLayout[0] = false;
        }
        if(name == "ArrowLeft"){
            contLayout[1] = false;
        }
        if(name == "ArrowDown"){
            contLayout[2] = false;
        }
        if(name == "ArrowRight"){
            contLayout[3] = false;
        }
        if(name == "w"){
            contLayout[0] = false;
        }
        if(name == "a"){
            contLayout[1] = false;
        }
        if(name == "s"){
            contLayout[2] = false;
        }
        if(name == "d"){
            contLayout[3] = false;
        }
        if(name == " "){
            contLayout[4] = false;
        }
        if(name == "Shift"){
            contLayout[5] = false;
        }
        if(name == "z"){
            contLayout[6] = false;
        }
        if(name == "x"){
            contLayout[7] = false;
        }
        if(name == "q"){
            contLayout[10] = false;
        }
      }, false);
}
function scaleUp(){
    displayScale--;
    display.style.width  = (256 * displayScale).toString() + "px";
    display.style.height = (192 * displayScale).toString() + "px";
}
function scaleDown(){
    displayScale++;
    display.style.width  = (256 * displayScale).toString() + "px";
    display.style.height = (192 * displayScale).toString() + "px";
}




