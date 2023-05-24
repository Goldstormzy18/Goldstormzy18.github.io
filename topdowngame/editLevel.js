var camX = 88;
var camY = 56;
var camHeight = 0;
var speed = 4;
var fps = 30;
//wasd
var contLayout = [false, false, false, false, false, false, false, false, false, false, false];
var contLayoutDown = [false, false, false, false, false, false, false, false, false, false, false];

var chunks = [];

var animationWalkCycles = [0,1,0,2];

var chunkWidth  = 8;
var chunkHeight = 6;
var editing = true;
var editTile = "00";

var mouseDown = false;
var rightMouseDown = false;

var displayScale = 4;
var mouseX = 0;
var mouseY = 0;

var renderWidth = 3;
var renderHeight = 3;
var edgeFallingImmunity = false;


var playerControl = true;
var moving = false;
var movingDir = new Vector2(0,0);
var animationTimer = 0;

var currentTileset = 1;

var playerSprite = new Image();
playerSprite.src = "Assets/SamuelWalk.png";

var tilesets = [];
tilesets[0] = new Image();
tilesets[0].src = "Assets/grassTiles.png";
tilesets[1] = new Image();
tilesets[1].src = "Assets/rockCliffTiles.png";
tilesets[2] = new Image();
tilesets[2].src = "Assets/plants.png";

var display = document.getElementById("display");
var ctx = display.getContext("2d");
document.title = "hello world";

var steps = 0;
var playerX = 2;
var playerY = 2;
var playerZ = 4;
var falling = 0;
var playerChunkX = 0;
var playerChunkY = 2;
var playerAnalogZ = playerZ * 16;
var mouseClicked = false;
var rightMouseClicked = false;

var onChunk = 0;

display.width  = 256;
display.height = 192;
initListeners();

ctx.fillRect(0,0,256,192);

initChunks()

setInterval(mainLoop, 1000/fps);

display.style.width = (256 * displayScale).toString() + "px";

function mainLoop(){
    //consoleClear();
    checkForInputs();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,256,192);
    ctx.fillStyle = "#00ff00";
    onChunk = playerChunkY + (playerChunkX * renderHeight);

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



    drawChunks();


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
    consoleLog(chunks[onChunk].chunkX);
    consoleLog(",");
    consoleLog(chunks[onChunk].chunkY);
    consoleLog(";");
    if((playerX % chunkWidth) - x < 0 ||
       (playerY % chunkHeight) - y < 0 ||
       (playerX % chunkWidth) - x > chunkWidth - 1 ||
       (playerY % chunkHeight) - y > chunkHeight - 1){
        
        playerChunkX -= x;
        playerChunkY += y;
        edgeFallingImmunity = true;
        //onChunk = playerChunkY + (playerChunkX * 2);
        return true;
    }
    if(chunks[onChunk].chunkHeights[(playerY % chunkHeight) + ((playerX % chunkWidth) * chunkHeight)] + 1 >= chunks[onChunk].chunkHeights[((playerY % chunkHeight) - y) + (((playerX % chunkWidth) - x) * chunkHeight)]){
        falling = (chunks[onChunk].chunkHeights[(playerY % chunkHeight) + ((playerX % chunkWidth) * chunkHeight)] - chunks[onChunk].chunkHeights[((playerY % chunkHeight) - y) + (((playerX % chunkWidth) - x) * chunkHeight)]) * speed;
        return true;
    }else{
        return false;
    }
}

function startWalking(xSpeed, ySpeed){
    playerX -= xSpeed / speed;
    playerY -= ySpeed / speed;
    if(edgeFallingImmunity){
        edgeFallingImmunity = false;
    }else{
        playerZ = chunks[onChunk].chunkHeights[(playerY % chunkHeight) + ((playerX % chunkWidth) * chunkHeight)];
    }
    animationTimer = 0;
    playerControl = false;
    moving = true;
    movingDir = new Vector2(xSpeed, ySpeed);
    //consoleSet(playerZ);
}

function drawLayer(height, xPos, yPos){
    var i = 0;
    var tileIndex = 0;
    var yHeight = (yPos * 16 * chunkHeight) - (height * 16) + playerAnalogZ;
    for(var x = 0; x < chunkWidth; x++){
        var ramX = (xPos * 16 * chunkWidth) + (x * 16);
        for(var y = 0; y < chunkHeight; y++){
            if(chunks[onChunk].chunkHeights[i] >= height && chunks[onChunk].chunkHeights[i] - chunks[onChunk].chunkWalls[i] < height){
                drawTile(chunks[onChunk].chunkPalette[i], height, ramX, yHeight + (y * 16) + 16, chunks[onChunk].chunkTiles[tileIndex + (height - (chunks[onChunk].chunkHeights[i] - chunks[onChunk].chunkWalls[i]) - 1)].x, chunks[onChunk].chunkTiles[tileIndex + (height - (chunks[onChunk].chunkHeights[i] - chunks[onChunk].chunkWalls[i]) - 1)].y);//draw walls
            }
            if(chunks[onChunk].chunkHeights[i] == height){
                for(var h = 0; h < chunks[onChunk].chunkWalls[i]; h++){
                    tileIndex++;
                }
                drawTile(chunks[onChunk].chunkPalette[i], height, ramX, yHeight + (y * 16), chunks[onChunk].chunkTiles[tileIndex].x, chunks[onChunk].chunkTiles[tileIndex].y);//draw floor
            }else{
                for(var h = 0; h < chunks[onChunk].chunkWalls[i]; h++){
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

function drawTile(palette, tile, xPos, yPos, xTile, yTile){
    ctx.drawImage(tilesets[palette], xTile, yTile, 16, 16, xPos + camX, yPos + camY + camHeight, 16, 16);
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

function drawChunks(){
    var i = 0;
    onChunk = 0;
    for(; i <= playerZ && i <= chunks[4].chunkTop; i++){
        for(; onChunk < chunks.length; onChunk++){
            drawLayer(i, chunks[onChunk].chunkX, chunks[onChunk].chunkY);
        }
        onChunk = 0;
    }
    drawPlayerBottom();
    onChunk = 0;
    if(playerZ < chunks[4].chunkTop){
        for(; onChunk < chunks.length; onChunk++){
            drawLayer(i, chunks[onChunk].chunkX, chunks[onChunk].chunkY)
        };
        i++;
        onChunk = 0;
    }
    drawPlayerTop();
    onChunk = 0;
    for(; i <= chunks[4].chunkTop; i++){
        for(; onChunk < chunks.length; onChunk++){
            drawLayer(i, chunks[onChunk].chunkX, chunks[onChunk].chunkY);
        }
        onChunk = 0;
    }
}



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
    generateChunkTopValue();
}

function generateChunkTopValue(){
    chunks[onChunk].chunkTop = 0;
    for(var i = 0; i < chunks[onChunk].chunkHeights.length; i++){
        if(chunks[onChunk].chunkHeights[i] > chunks[onChunk].chunkTop){
            chunks[onChunk].chunkTop = chunks[onChunk].chunkHeights[i]
        }
    }
}

function generateTiles(){
    var i = 0;
    for(var x = 0; x < chunkWidth; x++){
        for(var y = 0; y < chunkHeight; y++){
            var index = y + (x * chunkHeight);
            for(var h = chunks[onChunk].chunkWalls[index]; h > 0; h--){
                chunks[onChunk].chunkTiles[i] = calculateWallTiles(index, h - 1);
                i++;
            }
            chunks[onChunk].chunkTiles[i] = calculateFloorTiles(index);
            i++;
        }
    }
}

function calculateWallTiles(index, height){
    var x = 1;
    var y = 3;

    if(index > chunkHeight && index < (chunkHeight * chunkWidth) - chunkHeight){
        if(chunks[onChunk].chunkHeights[index + chunkHeight] + height >= chunks[onChunk].chunkHeights[index]){
            if(chunks[onChunk].chunkHeights[index - chunkHeight] + height >= chunks[onChunk].chunkHeights[index]){
                x = 1;
            }else{
                x = 0;
            }
        }else{
            if(chunks[onChunk].chunkHeights[index - chunkHeight] + height >= chunks[onChunk].chunkHeights[index]){
                x = 2;
            }else{
                x = 3;
            }
        }
    }
    if(chunks[onChunk].chunkWalls[index] == 1){
        y = 5
    }else if(height == 0){
        y = 2;
    }else if(height == chunks[onChunk].chunkWalls[index] - 1){
        y = 4;
    }
    
    
    return new Vector2(x * 16, y * 16);
}

function calculateFloorTiles(index){
    var x = 6;
    var y = 3;
    if(chunks[onChunk].chunkHeights[index + chunkHeight] < chunks[onChunk].chunkHeights[index]){
        x++;
    }
    if(chunks[onChunk].chunkHeights[index - chunkHeight] < chunks[onChunk].chunkHeights[index]){
        x--;
        if(x == 6){
            y = 5;
        }
    }
    if(chunks[onChunk].chunkHeights[index - 1] < chunks[onChunk].chunkHeights[index] && index % 6 != 0){
        y--;
    }


    return new Vector2((x) * 16, (y) * 16);

}

function generateWalls(){
    var i = 0;
    for(var y = 0; y < chunkHeight; y++){
        for(var x = 0; x < chunkWidth - 1; x++){

            if(y != chunkHeight - 1){
                chunks[onChunk].chunkWalls[y + (x * chunkHeight)] = chunks[onChunk].chunkHeights[y + (x * chunkHeight)] + chunks[onChunk].chunkHeights[y + (x * chunkHeight) + 1];
            }

        }
    }
    for(; i < chunks[onChunk].chunkHeights.length - 1; i++){
        if(i % chunkHeight != chunkHeight - 1){
            chunks[onChunk].chunkWalls[i] = chunks[onChunk].chunkHeights[i] - chunks[onChunk].chunkHeights[i + 1];
        }
    }
    for(; i < chunks[onChunk].chunkHeights.length; i++){
        chunks[onChunk].chunkWalls[i] = 0;
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

function initChunks(){
    chunks[0] = new Chunk();
    chunks[0].chunkHeights = [0,0,0,0,0,0,
                              5,5,5,5,5,0,
                              4,4,4,4,5,0,
                              4,4,4,4,5,0,
                              4,4,4,4,5,0,
                              4,4,4,4,5,0,
                              4,4,4,4,5,0,
                              4,4,4,4,5,0];
    chunks[0].chunkPalette = [0,0,0,0,0,0,
                              1,1,1,1,1,0,
                              0,0,0,0,1,0,
                              0,0,0,0,1,0,
                              0,0,0,0,1,0,
                              0,0,0,0,1,0,
                              0,0,0,0,1,0,
                              0,0,0,0,1,0];
    chunks[0].chunkX = 0;
    chunks[0].chunkY = 2;
    chunks[0].chunkTop = 0;
    chunks[0].chunkBottom = 0;
    onChunk = 0;
    generateChunk();

    chunks[1] = new Chunk();
    chunks[1].chunkHeights = [0,0,0,0,0,0,
                              5,4,4,4,4,5,
                              4,4,4,4,4,4,
                              4,4,4,4,4,4,
                              4,4,4,4,4,4,
                              4,4,4,4,4,4,
                              4,4,4,4,4,4,
                              4,4,4,4,4,4];
    chunks[1].chunkPalette = [0,0,0,0,0,0,
                              1,0,0,0,0,1,
                              0,0,0,0,0,0,
                              0,0,0,0,0,0,
                              0,0,0,0,0,0,
                              0,0,0,0,0,0,
                              0,0,0,0,0,0,
                              0,0,0,0,0,0];
    chunks[1].chunkX = 0;
    chunks[1].chunkY = 1;
    chunks[1].chunkTop = 0;
    chunks[1].chunkBottom = 0;
    onChunk = 1;
    generateChunk();

    chunks[2] = new Chunk();
    chunks[2].chunkHeights = [0,0,0,0,0,0,
                              0,5,5,5,5,5,
                              0,6,6,6,6,4,
                              0,6,6,6,5,4,
                              0,6,6,6,5,4,
                              0,6,6,6,6,4,
                              0,5,4,4,4,4,
                              0,5,4,4,4,4];
    chunks[2].chunkPalette = [0,0,0,0,0,0,
                              0,1,1,1,1,1,
                              0,1,1,1,1,0,
                              0,1,1,1,1,0,
                              0,1,1,1,1,0,
                              0,1,1,1,1,0,
                              0,1,0,0,0,0,
                              0,1,0,0,0,0];
    chunks[2].chunkX = 0;
    chunks[2].chunkY = 0;
    chunks[2].chunkTop = 0;
    chunks[2].chunkBottom = 0;
    onChunk = 2;
    generateChunk();

    chunks[3] = new Chunk();
    chunks[3].chunkHeights = [4,4,4,4,5,0,
                              5,5,5,5,5,0,
                              4,4,3,2,1,0,
                              4,4,3,2,1,0,
                              4,4,3,2,1,0,
                              4,4,3,2,1,0,
                              4,4,5,5,5,0,
                              4,4,4,4,5,0];
    chunks[3].chunkPalette = [0,0,0,0,1,0,
                              1,1,1,1,1,0,
                              0,0,0,0,0,0,
                              0,0,0,0,0,0,
                              0,0,0,0,0,0,
                              0,0,0,0,0,0,
                              0,0,1,1,1,0,
                              0,0,0,0,1,0];
    chunks[3].chunkX = 1;
    chunks[3].chunkY = 2;
    chunks[3].chunkTop = 0;
    chunks[3].chunkBottom = 0;
    onChunk = 3;
    generateChunk();
    
    chunks[4] = new Chunk();
    chunks[4].chunkHeights = [4,4,4,4,4,4,
                              4,4,4,5,4,5,
                              4,4,4,5,4,4,
                              4,4,6,5,4,4,
                              4,4,6,5,4,4,
                              4,4,6,6,4,4,
                              4,4,6,6,4,4,
                              4,4,6,6,4,4];
    chunks[4].chunkPalette = [0,0,0,0,0,0,
                              0,0,0,1,0,1,
                              0,0,0,1,0,0,
                              0,0,1,1,0,0,
                              0,0,1,1,0,0,
                              0,0,1,1,0,0,
                              0,0,1,1,0,0,
                              0,0,1,1,0,0];
    chunks[4].chunkX = 1;
    chunks[4].chunkY = 1;
    chunks[4].chunkTop = 0;
    chunks[4].chunkBottom = 0;
    onChunk = 4;
    generateChunk();

    chunks[5] = new Chunk();
    chunks[5].chunkHeights = [0,5,4,4,4,4,
                              0,5,4,4,4,4,
                              0,5,4,4,4,4,
                              0,5,4,4,4,4,
                              0,5,4,4,4,4,
                              0,5,4,4,4,4,
                              0,5,4,4,4,4,
                              0,5,4,4,4,4];
    chunks[5].chunkPalette = [0,1,0,0,0,0,
                              0,1,0,0,0,0,
                              0,1,0,0,0,0,
                              0,1,0,0,0,0,
                              0,1,0,0,0,0,
                              0,1,0,0,0,0,
                              0,1,0,0,0,0,
                              0,1,0,0,0,0];
    chunks[5].chunkX = 1;
    chunks[5].chunkY = 0;
    chunks[5].chunkTop = 0;
    chunks[5].chunkBottom = 0;
    onChunk = 5;
    generateChunk();

    chunks[6] = new Chunk();
    chunks[6].chunkHeights = [4,4,4,4,5,0,
                              4,4,4,4,5,0,
                              4,4,4,4,4,0,
                              4,4,4,4,3,0,
                              4,4,4,4,3,0,
                              4,4,4,4,4,0,
                              5,5,5,5,5,0,
                              0,0,0,0,0,0];
    chunks[6].chunkPalette = [0,0,0,0,1,0,
                              0,0,0,0,1,0,
                              0,0,0,0,1,0,
                              0,0,0,0,1,0,
                              0,0,0,0,1,0,
                              0,0,0,0,1,0,
                              1,1,1,1,1,0,
                              0,0,0,0,0,0];
    chunks[6].chunkX = 2;
    chunks[6].chunkY = 2;
    chunks[6].chunkTop = 0;
    chunks[6].chunkBottom = 0;
    onChunk = 6;
    generateChunk();

    chunks[7] = new Chunk();
    chunks[7].chunkHeights = [4,4,6,6,4,4,
                              6,6,6,6,5,4,
                              6,6,6,6,5,4,
                              5,4,4,4,4,4,
                              5,4,4,4,4,4,
                              5,4,4,4,4,4,
                              5,5,5,5,5,5,
                              0,0,0,0,0,0];
    chunks[7].chunkPalette = [0,0,1,1,0,0,
                              1,1,1,1,1,0,
                              1,1,1,1,1,0,
                              1,0,0,0,0,0,
                              1,0,0,0,0,0,
                              1,0,0,0,0,0,
                              1,1,1,1,1,1,
                              0,0,0,0,0,0];
    chunks[7].chunkX = 2;
    chunks[7].chunkY = 1;
    chunks[7].chunkTop = 0;
    chunks[7].chunkBottom = 0;
    onChunk = 7;
    generateChunk();

    chunks[8] = new Chunk();
    chunks[8].chunkHeights = [0,5,4,4,4,4,
                              0,6,6,6,6,6,
                              0,6,6,6,6,6,
                              0,5,4,4,4,5,
                              0,5,4,4,4,5,
                              0,5,4,4,4,5,
                              0,5,5,5,5,5,
                              0,0,0,0,0,0];
    chunks[8].chunkPalette = [0,1,0,0,0,0,
                              0,1,1,1,1,1,
                              0,1,1,1,1,1,
                              0,1,0,0,0,1,
                              0,1,0,0,0,1,
                              0,1,0,0,0,1,
                              0,1,1,1,1,1,
                              0,0,0,0,0,0];
    chunks[8].chunkX = 2;
    chunks[8].chunkY = 0;
    chunks[8].chunkTop = 0;
    chunks[8].chunkBottom = 0;
    onChunk = 8;
    generateChunk();
    
}



function Chunk(){
    this.chunkHeights = [];
    this.chunkPalette = [];
    this.chunkTiles = [];
    this.chunkWalls = [];
    var chunkX = 0;
    var chunkY = 0;
    var chunkTop = 0;
    var chunkBottom = 0;
}
function Vector2(x, y) {
    this.x = x;
    this.y = y;
}