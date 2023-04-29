var camX = 0;
var camY = 0;
var speed = 4;
//wasd
var contLayout = [0,0,0,0,0,0,0,0,0,0,0];
var level = "01010101010101011717171717171717262626262626262625252525252525250101010101010101010101010101010101010101010101010101010101010101";
var worldWidth  = 8;
var worldHeight = 8;
var animationTimer = 0;
var editing = true;
var editTile = 0;

var mouseDown = false;

var displayScale = 4;
var mouseX = 0;
var mouseY = 0;

var playerSprite = new Image();
playerSprite.src = "Assets/SamuelWalk.png";

var tilesets = [];
tilesets[0] = new Image();
tilesets[0].src = "Assets/overworldTiles.png";

var display = document.getElementById("display");
var ctx = display.getContext("2d");
document.title = "hello world";

var steps = 0;

display.width  = 256;
display.height = 192;
initListeners();

ctx.fillRect(0,0,256,192);

setInterval(mainLoop, 1000/30);

display.style.width = (256 * displayScale).toString() + "px";

function mainLoop(){
    checkForMovement();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,256,192);
    ctx.fillStyle = "#00ff00";
    drawLevel();

    if(editing){
        ctx.drawImage(tilesets[0], 16 * (editTile % (tilesets[0].width / 16)),  16 * Math.floor(editTile / (tilesets[0].width / 16)), 16, 16, (Math.round((mouseX - 8 - (camX % 16)) / 16) * 16) + (camX % 16), (Math.round((mouseY - 8 - (camY % 16)) / 16) * 16) + (camY % 16), 16, 16);
        if(contLayout[10]){
            drawPalette();
            editTile = Math.floor(mouseX / 16) + (Math.floor(mouseY / 16) * (tilesets[0].width / 16));
        }
    }else{
        drawPlayer();        
    }

    document.getElementById("debug").innerHTML = mouseY;

}

function drawLevel(){
    for(var x = 0; x < worldWidth; x++){
        for(var y = 0; y < worldHeight; y++){
            drawTile(camX + (x * 16), camY + (y * 16), 16, x, y);
        }
    }
}

function checkForMovement(){
    if(contLayout[0] == 1){
        camY += speed;
    }
    if(contLayout[1] == 1){
        camX += speed;
    }
    if(contLayout[2] == 1){
        camY -= speed;
    }
    if(contLayout[3] == 1){
        camX -= speed;
    }
}
function drawPlayer(){
    ctx.drawImage(playerSprite, 0, 0, 16, 32, 120, 80, 16, 32);
}

function square(x, y, size){
    ctx.fillRect(x, y, size, size);
}

function drawTile(xPos, yPos, size, x, y){
    ctx.drawImage(tilesets[0], 16 * (level.substring((x * 2) + (y * worldWidth * 2), (x * 2) + (y * worldWidth * 2) + 2) % (tilesets[0].width / 16)),  16 * Math.floor(level.substring((x * 2) + (y * worldWidth * 2), (x * 2) + (y * worldWidth * 2) + 2) / (tilesets[0].width / 16)), 16, 16, xPos, yPos, size, size);
}



function initListeners(){
    document.addEventListener('keydown', function(event){
        var name = event.key;
        var code = event.code;
        if(name == "ArrowUp"){
            contLayout[0] = 1;
        }
        if(name == "ArrowLeft"){
            contLayout[1] = 1;
        }
        if(name == "ArrowDown"){
            contLayout[2] = 1;
        }
        if(name == "ArrowRight"){
            contLayout[3] = 1;
        }
        if(name == "w"){
            contLayout[0] = 1;
        }
        if(name == "a"){
            contLayout[1] = 1;
        }
        if(name == "s"){
            contLayout[2] = 1;
        }
        if(name == "d"){
            contLayout[3] = 1;
        }
        if(name == "q"){
            contLayout[10] = 1;
        }
      }, false);
      document.addEventListener('keyup', function(event){
        var name = event.key;
        var code = event.code;
        if(name == "ArrowUp"){
            contLayout[0] = 0;
        }
        if(name == "ArrowLeft"){
            contLayout[1] = 0;
        }
        if(name == "ArrowDown"){
            contLayout[2] = 0;
        }
        if(name == "ArrowRight"){
            contLayout[3] = 0;
        }
        if(name == "w"){
            contLayout[0] = 0;
        }
        if(name == "a"){
            contLayout[1] = 0;
        }
        if(name == "s"){
            contLayout[2] = 0;
        }
        if(name == "d"){
            contLayout[3] = 0;
        }
        if(name == "q"){
            contLayout[10] = 0;
        }
      }, false);
}


display.addEventListener("mousemove", function(event){
    var displayBounds = display.getBoundingClientRect();
    mouseX = (event.clientX - displayBounds.left) / displayScale;
    mouseY = (event.clientY - displayBounds.top) / displayScale;
});
display.addEventListener("mousedown", function(){
    mouseDown = true;
});
display.addEventListener("mouseup", function(){
    mouseDown = false;
});




function drawPalette(){
    for(var x = 0; x < worldWidth; x++){
        for(var y = 0; y < worldHeight; y++){
            ctx.drawImage(tilesets[0], 16 * x,  16 * y, 16, 16, x * 16, y * 16, 16, 16);
        }
    }
}



