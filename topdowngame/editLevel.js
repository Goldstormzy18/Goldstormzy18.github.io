var camX = 120;
var camY = 88;
var camHeight = 0;
var speed = 4;
var fps = 30;
//wasd
var contLayout = [false, false, false, false, false, false, false, false, false, false, false];
var contLayoutDown = [false, false, false, false, false, false, false, false, false, false, false];
var chunkHeights = [2,2,1,0,0,0,
                    3,2,1,0,3,0,
                    2,2,1,1,2,0,
                    1,1,1,1,1,0,
                    1,1,1,1,1,0,
                    1,1,1,1,1,0,
                    1,0,0,2,1,0,
                    0,0,0,0,0,0];
var chunkTiles = [];
var chunks = [];

var chunkWalls = [];

var animationWalkCycles = [0,1,0,2];

var chunkWidth  = 8;
var chunkHeight = 6;
var editing = true;
var editTile = "00";
var chunkElevation = 3;

var mouseDown = false;
var rightMouseDown = false;

var displayScale = 4;
var mouseX = 0;
var mouseY = 0;

var playerControl = true;
var moving = false;
var movingDir = new Vector2(0,0);
var animationTimer = 0;

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
var playerX = 0;
var playerY = 0;
var playerZ = 2;
var falling = 0;
var playerAnalogZ = playerZ * 16;
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
    //consoleClear();
    checkForInputs();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,256,192);
    ctx.fillStyle = "#00ff00";

    if(playerControl){
        playerAnalogZ = playerZ * 16;
        falling = 0;
        if(contLayout[0] && checkForCollision(0, 1)){
            startWalking(0, speed);
        }else if(contLayout[1] && checkForCollision(1, 0)){
            startWalking(speed, 0);
        }else if(contLayout[3] && checkForCollision(-1, 0)){
            startWalking(0 - speed, 0);
        }else if(contLayout[2] && checkForCollision(0, -1)){
            startWalking(0, 0 - speed);
        }
    }
    if(moving){
        camX += movingDir.x;
        camY += movingDir.y;
        animationTimer++;
        if(animationTimer == 16 / speed){
            moving = false;
            playerControl = true;
        }
        playerAnalogZ -= falling;

    }

    //consoleLog(playerX);
    //consoleLog(playerY);



    var i = 0;
    for(; i <= playerZ && i <= chunkElevation; i++){
        drawLayer(i, 0, 0);
    }
    drawPlayerBottom();
    if(playerZ < chunkElevation){
        drawLayer(i, 0, 0);
        i++;
    }
    drawPlayerTop();
    for(; i <= chunkElevation; i++){
        drawLayer(i, 0, 0);
    }


    /*drawLayer(0, 0, 0);
    drawLayer(1, 0, 0);
    drawLayer(2, 0, 0);
    drawPlayerBottom();
    drawLayer(3, 0, 0);
    drawPlayerTop();
    //drawLayer(2, 0, 0);*/

    mouseClicked = false;
    rightMouseClicked = false;
    //consoleLog(chunkWalls);
}

function checkForCollision(x, y){
    if(chunkHeights[playerY + (playerX * chunkHeight)] + 1 >= chunkHeights[(playerY - y) + ((playerX - x) * chunkHeight)] &&
    playerX - x >= 0 &&
    playerY - y >= 0 &&
    playerX - x <= chunkWidth - 1 &&
    playerY - y <= chunkHeight - 1){
        falling = (chunkHeights[playerY + (playerX * chunkHeight)] - chunkHeights[(playerY - y) + ((playerX - x) * chunkHeight)]) * speed;
        
        return true;
    }else{
        
        return false;
    }
}

function startWalking(xSpeed, ySpeed){
    playerX -= xSpeed / speed;
    playerY -= ySpeed / speed;
    playerZ = chunkHeights[playerY + (playerX * chunkHeight)];
    animationTimer = 0;
    playerControl = false;
    moving = true;
    movingDir = new Vector2(xSpeed, ySpeed);
    //consoleSet(playerZ);
}

function drawLayer(height, xPos, yPos){
    var i = 0;
    var tileIndex = 0;
    var yHeight = yPos - (height * 16) + playerAnalogZ;
    for(var x = 0; x < chunkWidth; x++){
        var ramX = xPos + (x * 16);
        for(var y = 0; y < chunkHeight; y++){
            if(chunkHeights[i] >= height && chunkHeights[i] - chunkWalls[i] < height){
                drawTile(height, ramX, yHeight + (y * 16) + 16, chunkTiles[tileIndex + (height - (chunkHeights[i] - chunkWalls[i]) - 1)].x, chunkTiles[tileIndex + (height - (chunkHeights[i] - chunkWalls[i]) - 1)].y);//draw walls
            }
            if(chunkHeights[i] == height){
                for(var h = 0; h < chunkWalls[i]; h++){
                    tileIndex++;
                }
                drawTile(height, ramX, yHeight + (y * 16), chunkTiles[tileIndex].x, chunkTiles[tileIndex].y);//draw floor
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
    generateChunkElevationValue();


}

function generateChunkElevationValue(){
    chunkElevation = 0;
    for(var i = 0; i < chunkHeights.length; i++){
        if(chunkHeights[i] > chunkElevation){
            chunkElevation = chunkHeights[i]
        }
    }
}

function generateTiles(){
    var i = 0;
    for(var x = 0; x < chunkWidth; x++){
        for(var y = 0; y < chunkHeight; y++){
            var index = y + (x * chunkHeight);
            for(var h = chunkWalls[index]; h > 0; h--){
                chunkTiles[i] = calculateWallTiles(index, h - 1);
                i++;
            }
            chunkTiles[i] = calculateFloorTiles(index);
            i++;
        }
    }
}

function calculateWallTiles(index, height){
    var x = 1;
    var y = 3;
    if(chunkHeights[index + chunkHeight] + height >= chunkHeights[index]){
        if(chunkHeights[index - chunkHeight] + height >= chunkHeights[index]){
            x = 1;
        }else{
            x = 0;
        }
    }else{
        if(chunkHeights[index - chunkHeight] + height >= chunkHeights[index]){
            x = 2;
        }else{
            x = 3;
        }
    }
    if(chunkWalls[index] == 1){
        y = 5
    }else if(height == 0){
        y = 2;
    }else if(height == chunkWalls[index] - 1){
        y = 4;
    }
    
    
    return new Vector2(x * 16, y * 16);
}

function calculateFloorTiles(index){
    var x = 6;
    var y = 3;
    if(chunkHeights[index + chunkHeight] < chunkHeights[index]){
        x++;
    }
    if(chunkHeights[index - chunkHeight] < chunkHeights[index]){
        x--;
        if(x == 6){
            y = 5;
        }
    }
    if(chunkHeights[index - 1] < chunkHeights[index]){
        y--;
    }


    return new Vector2((x) * 16, (y) * 16);

}

function generateWalls(){
    var i = 0;
    for(var y = 0; y < chunkHeight; y++){
        for(var x = 0; x < chunkWidth - 1; x++){
            chunkWalls[y + (x * chunkHeight)] = chunkHeights[y + (x * chunkHeight)] + chunkHeights[y + (x * chunkHeight) + 1];
        }
    }
    for(; i < chunkHeights.length - 1; i++){
        chunkWalls[i] = chunkHeights[i] - chunkHeights[i + 1];
        if(chunkWalls[i] < 0){
            //chunkWalls[i] = 0;
        }
    }
    for(; i < chunkHeights.length; i++){
        chunkWalls[i] = 0;
    }
}


function checkForInputs(){
    /*if(contLayout[0]){
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
    }*/
}

function initListeners(){
    document.addEventListener('keydown', function(event){
        var name = event.key;
        var code = event.code;
        // switch(name){
        //     case "ArrowUp":
        //     case "w":
        //         contLayout[0] = true;
        //         break;
        //     case "ArrowLeft":
        //     case "a":
        //         contLayout[1] = true;
        //         break;
        //     case "ArrowDown":
        //     case "s":
        //         contLayout[2] = true;
        //         break;
        //     case "ArrowRight":
        //     case "d":
        //         contLayout[3] = true;
        //         break;
        //     case " ":
        //         contLayout[4] = true;
        //         break;
        //     case "Shift":
        //         contLayout[5] = true;
        //         break;
        //     case "q":
        //         contLayout[10] = true;
        //         break;
                
        // }
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