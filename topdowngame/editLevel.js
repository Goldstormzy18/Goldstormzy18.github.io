var camX = 0;
var camY = 0;
var camHeight = 0;
var speed = 4;
var fps = 30;
//wasd
var contLayout = [false, false, false, false, false, false, false, false, false, false, false];
var chunkHeights = [2,2,1,0,0,0,
                    2,2,1,0,3,0,
                    2,2,1,1,0,0,
                    1,1,1,1,1,0,
                    1,1,1,1,1,0,
                    1,1,1,1,1,0,
                    1,0,0,0,0,0,
                    0,0,0,0,0,0];
var chunkTiles = [];
var chunks = [];

var chunkWalls = [];

var chunkWidth  = 8;
var chunkHeight = 6;
var animationTimer = 0;
var editing = true;
var editTile = "00";

var mouseDown = false;
var rightMouseDown = false;

var displayScale = 4;
var mouseX = 0;
var mouseY = 0;

var currentTileset = 1;

var playerSprite = new Image();
playerSprite.src = "Assets/SamuelWalk.png";

var tilesets = [];
tilesets[0] = new Image();
tilesets[0].src = "Assets/overworldTiles.png";
tilesets[1] = new Image();
tilesets[1].src = "Assets/testTiles.png";

var display = document.getElementById("display");
var ctx = display.getContext("2d");
document.title = "hello world";

var steps = 0;

var mouseClicked = false;
var rightMouseClicked = false;

display.width  = 256;
display.height = 192;
initListeners();

ctx.fillRect(0,0,256,192);

generateChunk();

setInterval(mainLoop, 1000/fps);

display.style.width = (256 * displayScale).toString() + "px";

function mainLoop(){
    checkForInputs();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,256,192);
    ctx.fillStyle = "#00ff00";

    drawLayer(0, 0, 0);
    drawLayer(1, 0, 0);
    drawPlayerBottom();
    drawLayer(2, 0, 0);
    drawPlayerTop();
    drawLayer(3, 0, 0);
    //drawLayer(2, 0, 0);

    mouseClicked = false;
    rightMouseClicked = false;
    //consoleLog(chunkWalls);
}

function drawLayer(height, xPos, yPos){
    consoleClear();
    var i = 0;
    var tileIndex = 0;
    var yHeight = yPos - (height * 16)
    for(var x = 0; x < chunkWidth; x++){
        var ramX = xPos + (x * 16);
        for(var y = 0; y < chunkHeight; y++){
            if(chunkHeights[i] >= height && chunkHeights[i] - chunkWalls[i] < height){
                drawTile(height, ramX, yHeight + (y * 16) + 16, chunkTiles[tileIndex].x, chunkTiles[tileIndex].y);
            }
            if(chunkHeights[i] == height){
                for(var h = 0; h < chunkWalls[i]; h++){
                    consoleLog(chunkWalls);
                    tileIndex++;
                }
                drawTile(height, ramX, yHeight + (y * 16), chunkTiles[tileIndex].x, chunkTiles[tileIndex].y);
            }else{
                for(var h = 0; h < chunkWalls[i]; h++){
                    tileIndex++;
                }
            }
            tileIndex++;
            i++;
        }
    }
}




function drawPlayerTop(){
    ctx.drawImage(playerSprite, 0, 0, 16, 16, 120, 72, 16, 16);
}
function drawPlayerBottom(){
    ctx.drawImage(playerSprite, 0, 16, 16, 16, 120, 88, 16, 16);
}

function drawTile(tile, xPos, yPos, xTile, yTile){
    ctx.drawImage(tilesets[1], xTile, yTile, 16, 16, xPos + camX, yPos + camY + camHeight, 16, 16);
}




display.addEventListener("mousemove", function(event){
    var displayBounds = display.getBoundingClientRect();
    mouseX = (event.clientX - displayBounds.left) / displayScale;
    mouseY = (event.clientY - displayBounds.top) / displayScale;
});
display.addEventListener("mousedown", function(event){
    if(event.button == 0){
        mouseDown = true;
        mouseClicked = true;
    }
    if(event.button == 2){
        rightMouseDown = true;
        rightMouseClicked = true;
    }
});
display.addEventListener("mouseup", function(event){
    if(event.button == 0){
        mouseDown = false;
    }
    if(event.button == 1){
        rightMouseDown = false;
    }
});





function consoleLog(input){
    document.getElementById("debug").innerHTML += input;
}
function consoleSet(input){
    document.getElementById("debug").innerHTML = input;
}
function consoleClear(input){
    document.getElementById("debug").innerHTML = "";
}


function generateChunk(){
    generateWalls();
    generateTiles();



}

function generateTiles(){
    var i = 0;
    for(var x = 0; x < chunkWidth; x++){
        for(var y = 0; y < chunkHeight; y++){
            var index = y + (x * chunkHeight);
            for(h = 0; h < chunkWalls[index]; h++){
                chunkTiles[i] = calculateWallTiles(index);
                i++;
            }
            chunkTiles[i] = calculateFloorTiles(index);
            i++;
        }
    }
}

function calculateWallTiles(index){
    if(chunkHeights[index + chunkHeight] >= chunkHeights[index]){
        if(chunkHeights[index - chunkHeight] >= chunkHeights[index]){
            return new Vector2(16, 48);
        }else{
            return new Vector2(0, 48);
        }
    }else{
        if(chunkHeights[index - chunkHeight] >= chunkHeights[index]){
            return new Vector2(32, 48);
        }else{
            return new Vector2(48, 48);
        }
    }
}

function calculateFloorTiles(index){
    var x = 2;
    var y = 2;
    if(chunkHeights[index + chunkHeight] < chunkHeights[index]){
        x++;
    }
    if(chunkHeights[index - chunkHeight] < chunkHeights[index]){
        x--;
        if(x == 2){
            y = 3;
        }
    }


    return new Vector2((x + 4) * 16, (y + 1) * 16);

}

function generateWalls(){
    var i = 0;
    for(var y = 0; y < chunkHeight; y++){
        for(var x = 0; x < chunkWidth - 1; x++){
            chunkWalls[y + (x * chunkHeight)] = chunkHeights[y + (x * chunkHeight)] + chunkHeights[y + (x * chunkHeight) + 1];
        }
    }
    for(; i < chunkHeights.length - chunkWidth; i++){
        chunkWalls[i] = chunkHeights[i] - chunkHeights[i + 1];
        if(chunkWalls[i] < 0){
            chunkWalls[i] = 0;
        }
    }
    for(; i < chunkHeights.length; i++){
        chunkWalls[i] = 0;
    }
}


function checkForInputs(){
    if(contLayout[0]){
        camY += speed;
    }
    if(contLayout[1]){
        camX += speed;
    }
    if(contLayout[2]){
        camY -= speed;
    }
    if(contLayout[3]){
        camX -= speed;
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
        if(name == "q"){
            contLayout[10] = false;
        }
      }, false);
}




function Vector2(x, y) {
    this.x = x;
    this.y = y;
}