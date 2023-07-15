var worldString = "";
var worldWidth = 50;
var worldHeight = 30;
var keyPressDown = false;

var inBattle = false;
var life = 3;
var level = 1;
updateGui();
var playerX = 0;
var playerY = 0;

var battleLoopOrigin;
var battleTiming = 0;

var enemyHealth = 9;

var battleScreen = "0123456789";

var roomListX = [];
var roomListY = [];
generateWorld(6);

enableMovementGui();
disableBattleGui();


updateScreen();




//main method for generating the level
function generateWorld(rooms){
    updateGui();
    playerX = 0;
    playerY = 0;
    worldString = "";
    roomListX = [];
    roomListY = [];

    for(var y = 0; y < worldHeight; y++){
        for(var x = 0; x < worldWidth; x++){
            worldString += "W";
        }
        worldString += "<br/>";
    }

    for(var i = 0; i < rooms; i++){
        var roomWidth  = Math.floor(Math.random() * 4) + 5;
        var roomHeight = Math.floor(Math.random() * 4) + 5;
        var roomPosX = Math.floor(Math.random() * (worldWidth  - roomWidth  - 2)) + 1;
        var roomPosY = Math.floor(Math.random() * (worldHeight - roomHeight - 2)) + 1;
        for(var y = 0; y < roomHeight; y++){
            worldString = worldString.substring(0, coordsToWorldPos(roomPosX, roomPosY + y)) + addWidthToRoom(roomWidth) + worldString.substring(coordsToWorldPos(roomPosX + roomWidth - 1, roomPosY + y) + 1, worldString.length);
        }
        roomListX.push(roomPosX + Math.floor(roomWidth / 2));
        roomListY.push(roomPosY + Math.floor(roomHeight / 2));
    }
    
    for(var i = 0; i < roomListX.length - 1; i++){
        //var corridorWidth  = Math.abs(roomListX[i + 1] - roomListX[i]);
        for(var x = 0; Math.abs(x) < Math.abs(roomListX[i + 1] - roomListX[i]); x++){
            worldString = worldString.substring(0, coordsToWorldPos(roomListX[i] + x, roomListY[i])) + "." + worldString.substring(coordsToWorldPos(roomListX[i] + x, roomListY[i]) + 1, worldString.length);
            if(roomListX[i + 1] < roomListX[i]){
                x -= 2;
            }
        }
    }

    for(var i = 0; i < roomListY.length - 1; i++){
        //var corridorWidth  = Math.abs(roomListX[i + 1] - roomListX[i]);
        for(var y = 0; Math.abs(y) < Math.abs(roomListY[i + 1] - roomListY[i]); y++){
            worldString = worldString.substring(0, coordsToWorldPos(roomListX[i + 1], roomListY[i] + y)) + "." + worldString.substring(coordsToWorldPos(roomListX[i + 1], roomListY[i] + y) + 1, worldString.length);
            if(roomListY[i + 1] < roomListY[i]){
                y -= 2;
            }
        }
    }



    generatePlayer();
    generateObject("E");
    generateObject("H");
    generateObject("M");
    generateObject("M");
    generateObject("M");
    generateObject("M");






    
}

//converts coordinates to position in string
function coordsToWorldPos(inputX, inputY)
{
    return inputX + (inputY * (worldWidth + 5));
}




//moves player a certain amount of tiles
function movePlayer(dirX, dirY){
    worldString = worldString.substring(0, coordsToWorldPos(playerX, playerY)) + "." + worldString.substring(coordsToWorldPos(playerX, playerY) + 1, worldString.length)
    playerX += dirX;
    playerY += dirY;
    if(playerObject() == "W" || playerObject() == "M"){
        playerX -= dirX;
        playerY -= dirY;
    }
    if(playerObject() == "E"){
        generateWorld(6);
        level++;
        updateGui();
        updateScreen();
    }else{
        if(playerObject() == "H"){
            life ++;
            updateGui();
        }
        worldString = worldString.substring(0, coordsToWorldPos(playerX, playerY)) + "P" + worldString.substring(coordsToWorldPos(playerX, playerY) + 1, worldString.length)
        updateScreen();
        //i couldn't turn this into a switch or for statement ;-;
        if(       detectPos(1, 0)   == "M"){
            battleStart();
        } else if(detectPos(1, -1)  == "M"){
            battleStart();
        } else if(detectPos(0, -1)  == "M"){
            battleStart();
        } else if(detectPos(-1, -1) == "M"){
            battleStart();
        } else if(detectPos(-1, 0)  == "M"){
            battleStart();
        } else if(detectPos(-1, 1)  == "M"){
            battleStart();
        } else if(detectPos(0, 1)   == "M"){
            battleStart();
        } else if(detectPos(1, 1)   == "M"){
            battleStart();
        }
    }
}
//detects a position relative to the player
function detectPos(offsetX, offsetY){
    return worldString.substring(coordsToWorldPos(playerX + offsetX, playerY + offsetY), coordsToWorldPos(playerX + offsetX, playerY + offsetY) + 1);
}
//returns which object is in the player's coordinates, used mostly when in the middle of moving the player
function playerObject(){
    return worldString.substring(coordsToWorldPos(playerX, playerY), coordsToWorldPos(playerX, playerY) + 1);
}

function deleteEnemy(offsetX, offsetY){
    worldString = worldString.substring(0, coordsToWorldPos(playerX + offsetX, playerY + offsetY)) + "." + worldString.substring(coordsToWorldPos(playerX + offsetX, playerY + offsetY) + 1, worldString.length);
    updateScreen();
}
function newGame(){
    enableMovementGui();
    clearInterval(battleLoopOrigin);
    inBattle = false;
    life = 3;
    level = 1;
    roomListX = [];
    roomListY = [];
    generateWorld(6);
    enableMovementGui();
    disableBattleGui();
    updateScreen(); 
}

//generates an object depending on which object you want
function generateObject(object){
    var objX;
    var objY;
    while(worldString.substring(coordsToWorldPos(objX, objY), coordsToWorldPos(objX, objY) + 1) != "."){
        objX = Math.floor(Math.random() * worldWidth);
        objY = Math.floor(Math.random() * worldHeight);
    }
    worldString = worldString.substring(0, coordsToWorldPos(objX, objY)) + object + worldString.substring(coordsToWorldPos(objX, objY) + 1, worldString.length)
}
//Special generation method that spawns both player character and player position variables
function generatePlayer(){
    while(worldString.substring(coordsToWorldPos(playerX, playerY), coordsToWorldPos(playerX, playerY) + 1) != "."){
        playerX = Math.floor(Math.random() * worldWidth);
        playerY = Math.floor(Math.random() * worldHeight);
    }
    worldString = worldString.substring(0, coordsToWorldPos(playerX, playerY)) + "P" + worldString.substring(coordsToWorldPos(playerX, playerY) + 1, worldString.length)
}
//During world generation, this makes each horizontal slice of a room wider depending on an input
function addWidthToRoom(input){
    var output = "";
    for(var i = 0; i < input; i++){
        output += ".";
    }
    return output;
}

//what happens when you get near an enemy
function battleStart(){
    disableMovementGui();
    battleTiming = 0;
    enemyHealth = 9;
    inBattle = true;
    updateBattleGui();
    battleLoopOrigin = setInterval(battleLoop, 60);
}
//what happens every frame of battle
function battleLoop(){
    battleTiming++;
    battleTiming = battleTiming % 10;
    document.getElementById("battleView").innerHTML = battleScreen.substring(0, battleTiming) + "+" + battleScreen.substring(battleTiming + 1, battleScreen.length);
}
//What happens when you click the attack button during combat
function attackButton(){
    enemyHealth -= battleTiming;
    updateBattleGui();
    if(enemyHealth <= 0){
        //document.getElementById("console").innerHTML = detectPos(0, -1);
        enableMovementGui();
        clearInterval(battleLoopOrigin);
        inBattle = false;
        if(detectPos(1, 0)   == "M"){
            deleteEnemy(1, 0);
        }
        if(detectPos(1, -1)  == "M"){
            deleteEnemy(1, -1);
        }
        if(detectPos(0, -1)  == "M"){
            deleteEnemy(0, -1);
        }
        if(detectPos(-1, -1) == "M"){
            deleteEnemy(-1, -1);
        }
        if(detectPos(-1, 0)  == "M"){
            deleteEnemy(-1, 0);
        }
        if(detectPos(-1, 1)  == "M"){
            deleteEnemy(-1, 1);
        }
        if(detectPos(0, 1)   == "M"){
            deleteEnemy(0, 1);
        }
        if(detectPos(1, 1)   == "M"){
            deleteEnemy(1, 1);
        }
    }else{
        life--;
        updateGui();
        if(life <= 0){
            newGame();
        }
    }
}

//These functions enable/disable the GUIs for battle and for movement
function disableMovementGui(){
    document.getElementById("upButton").style.display = "none";
    document.getElementById("downButton").style.display = "none";
    document.getElementById("leftButton").style.display = "none";
    document.getElementById("rightButton").style.display = "none";
    document.getElementById("superUpButton").style.display = "none";
    document.getElementById("superDownButton").style.display = "none";
    document.getElementById("superLeftButton").style.display = "none";
    document.getElementById("superRightButton").style.display = "none";
    document.getElementById("movementDescription").style.display = "none";
    document.getElementById("superMovementDescription").style.display = "none";
    enableBattleGui();
}
function enableMovementGui(){
    document.getElementById("upButton").style.display = "";
    document.getElementById("downButton").style.display = "";
    document.getElementById("leftButton").style.display = "";
    document.getElementById("rightButton").style.display = "";
    document.getElementById("superUpButton").style.display = "";
    document.getElementById("superDownButton").style.display = "";
    document.getElementById("superLeftButton").style.display = "";
    document.getElementById("superRightButton").style.display = "";
    document.getElementById("movementDescription").style.display = "";
    document.getElementById("superMovementDescription").style.display = "";
    disableBattleGui();
}
function enableBattleGui(){
    document.getElementById("battleView").style.display = "";
    document.getElementById("battleButton").style.display = "";
    document.getElementById("enemyHealth").style.display = "";
    updateBattleGui();

}
function disableBattleGui(){
    document.getElementById("battleView").style.display = "none";
    document.getElementById("battleButton").style.display = "none";
    document.getElementById("enemyHealth").style.display = "none";
}

//updates the GUI that shows player health
function updateGui(){
    document.getElementById("life").innerHTML = "Life = " + life + ", Level = " + level;
}
//updates the GUI for battle, but not the movement GUI
function updateBattleGui(){
    document.getElementById("enemyHealth").innerHTML = "Enemy Health = " + enemyHealth;
}
//updates the main "battlefield" but not the GUI or battle GUI
function updateScreen(){
    document.getElementById("display").innerHTML = worldString;
}

//Direction buttons from html, these move you once in a direction
function upButton(){
    movePlayer(0, -1);
}
function downButton(){
    movePlayer(0, 1);
}
function leftButton(){
    movePlayer(-1, 0);
}
function rightButton(){
    movePlayer(1, 0);
}
//SUPER buttons from html, these basically make you move 3 times
//3 lines of code take the same space as a for statement and is a bit easier on the eyes
function superUpButton(){
    movePlayer(0, -1);
    if(!inBattle){
        movePlayer(0, -1);
    }
    if(!inBattle){
        movePlayer(0, -1);
    }
}
function superDownButton(){
    movePlayer(0, 1);
    if(!inBattle){
    movePlayer(0, 1);
    }
    if(!inBattle){
    movePlayer(0, 1);
    }
}
function superLeftButton(){
    movePlayer(-1, 0);
    if(!inBattle){
    movePlayer(-1, 0);
    }
    if(!inBattle){
    movePlayer(-1, 0);
    }
}
function superRightButton(){
    movePlayer(1, 0);
    if(!inBattle){
    movePlayer(1, 0);
    }
    if(!inBattle){
    movePlayer(1, 0);
    }
}

document.addEventListener('keydown', function(event){
    if(!inBattle){
        var name = event.key;
        var code = event.code;
        if(name == "w"){
            upButton();
        }
        if(name == "a"){
            leftButton();
        }
        if(name == "s"){
            downButton();
        }
        if(name == "d"){
            rightButton();
        }
    }
}, false);
document.addEventListener('keyup', function(event){
    if(inBattle){
        var name = event.key;
        var code = event.code;
        if(name == " "){
            attackButton();
        }
    }
}, false);







