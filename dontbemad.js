var players = document.getElementById('players');
var availableColors = ['Red', 'Blue', 'Green', 'Yellow'];
var playersColors = [];
var listPawns = [];
var currentPlayer = 1;
var rollBtn = document.getElementById('rollDice');
var rollResult = document.getElementById('rollResult');
var rollValue = null;
var currentPlayerDiv = document.getElementById('currentPlayer');
// <img src="images/redPawn.png" alt="" style="width: 40px; height: 40px"/>

var Pawn = function (player, id, position, color){
    this.id = id;
    this.player = player;
    this.position = position;
    this.color = color;
    this.isSelected = false;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function rollDice(){
      return getRandomInt(1,7);
};

var setPlayerColor = function(num){
    initColors();
    document.getElementById('playerNumber').innerHTML = num;
    document.getElementById('chooseColor').style.display = 'block';
};

function findPawnById(id){
    var pawn;
    for(var i = 0; i < listPawns.length; i += 1){
        if(listPawns[i].id === id){
            pawn = listPawns[i];
        }
    }
    return pawn;
};

var play = function(){
    players.value = document.getElementById('players').value;
    document.getElementById('startInfo').style.display = 'none';
    setPlayerColor(1);
};

function deselectPawns(){
    for(var i = 0; i < listPawns.length; i += 1){
        listPawns[i].isSelected = false;
    }
    var pawnImages = document.getElementsByClassName('pawnImage');
    for(var i = 0; i < pawnImages.length; i += 1){
        pawnImages[i].style.boxShadow = '';
    }
};

function isThereOwnPawn(destination){
    var destChilds;
    var hasOwnPawn = false;
    if(destination !== null){
        destChilds = destination.childNodes;
        for(var i = 0; i < destChilds.length; i += 1){
            if(destChilds[i].id.indexOf('player' + currentPlayer + 'pawn') > -1){
                hasOwnPawn = true;
            }
        }
    }
    return hasOwnPawn;
};

// for test


function getNextField(curField){
    var fieldType = curField.id.indexOf('field') > -1 ? 'field' : 'garage';
    var fieldNum;
    var nextfieldNum;
    var nextField;
    if(fieldType === 'field'){
        fieldNum = parseInt(curField.id.substring(5, curField.id.length));
        nextfieldNum = ((fieldNum + 1) % 48) === 0 ? 48 : (fieldNum + 1) % 48;
        nextField = document.getElementById('field' + nextfieldNum);
        if(nextField.className === 'player' + currentPlayer + 'Start'){
            nextField = document.getElementById('player' + currentPlayer + 'Garage1');
        }
        return nextField;
    }else{
        fieldNum = parseInt(curField.id.substring(13, curField.id.length));
        nextfieldNum = fieldNum + 1;
        nextField = document.getElementById('player' + currentPlayer + 'Garage' + nextfieldNum);
        return nextField;
    }
};

function getDest(pawnPos){
    var destPos;
    var num = rollValue;
    if(pawnPos === 'player' + currentPlayer + 'Base'){
        destPos = document.getElementsByClassName('player' + currentPlayer + 'Start')[0];
        return destPos;
    }else{
        destPos = document.getElementById(pawnPos);
        while(num > 0 && destPos !== null){
            destPos = getNextField(destPos);
            num -= 1;
        }
        return destPos;
    }
};

function checkDestinationAvailability(curPos){
    var dest = getDest(curPos);
    if(dest !== null){
        return (!isThereOwnPawn(dest));
    }else{
        return false;
    }

};

function canMovePawn(pawn){
    if (pawn.position === 'player' + currentPlayer + 'Base'){
        if(rollValue == 6){
            return true;
        }
    }else if(checkDestinationAvailability(pawn.position)){
        return true;

    }else{
        return false;
    }

    return false;
};

function selectPawn(pawnImage, pawn){
    if(checkDestinationAvailability(pawn.position)){
        deselectPawns();
        pawnImage.style.boxShadow = 'inset 0px 0px 0px 5px #000';
        pawn.isSelected = true;
    }
    if((pawn.position == 'player' + currentPlayer + 'Base') && (rollValue != 6)){
        deselectPawns();
    }
};

function clickImage(e){
    if(rollValue !== null){
        var pawn = findPawnById(e.currentTarget.id);
        if(pawn.player === 'player' + currentPlayer){
            if(!pawn.isSelected){
                selectPawn(e.currentTarget, pawn);
            }else {
                movePawn(pawn);
            }
        }
    }
};

function initPawns(playerNum){
    var playerBase = document.getElementById('player' + playerNum + 'Base');
    var player = 'player' + playerNum;
    var position = 'player' + playerNum + 'Base';
    var color = playersColors[playerNum];
    for (var i = 1; i <= 4; i += 1){
        var pawnId = 'player' + playerNum + 'pawn' + i;
        listPawns.push(new Pawn(player, pawnId, position, color));
        var imageTag = document.createElement('img');
        imageTag.src = 'images/' + playersColors[playerNum].toLowerCase() + 'Pawn.png';
        imageTag.style.width = '40px';
        imageTag.style.height = '40px';
        imageTag.alt = pawnId;
        imageTag.id = pawnId;
        imageTag.className = 'pawnImage';
        imageTag.addEventListener('click', clickImage, false);
        playerBase.appendChild(imageTag);
    }
};

function initColors(){
    var colorsCombobox = document.getElementById('availColors');
    colorsCombobox.innerHTML = '';
    for (var i = 0; i < availableColors.length; i += 1){
        if(availableColors[i] != undefined){
            var node = document.createElement('option');
            node.value = availableColors[i].toLowerCase();
            node.innerHTML = availableColors[i];
            colorsCombobox.appendChild(node);
        }
    }
};

var selectColor = function(){
    var num = parseInt(document.getElementById('playerNumber').innerHTML);
    var colorsCombobox = document.getElementById('availColors');
    var color = colorsCombobox[colorsCombobox.selectedIndex].text ;
    playersColors[num] = color;
    availableColors.splice(availableColors.indexOf(color), 1);
    if(num < players.value)
    {
        setPlayerColor(num + 1);
    } else {
        document.getElementById('chooseColor').style.display = 'none';
        initPlayGround();
    }
};

function renderCurrentPlayer(player){
    currentPlayerDiv.innerHTML = 'Current player: Player' + player;
    currentPlayerDiv.style.backgroundColor = playersColors[player];
};

function initPlayGround(){
    var playgroundTable = document.getElementById('playgroundTable');
    playgroundTable.style.textAlign = 'center';
    var notFields  = document.getElementsByClassName('notField');
    for (var i = 0; i < notFields.length; i += 1){
        notFields[i].style.backgroundColor = 'black';
    }

    for(var i = 1; i <= players.value; i += 1){
        initPawns(i);
        var baseCell = document.getElementById('player' + i + 'Base');
        baseCell.style.backgroundColor = playersColors[i].toLowerCase();
        var garageCells = document.getElementsByClassName('player' + i + 'Garage');
        for(var j = 0; j < garageCells.length; j += 1){
            garageCells[j].style.backgroundColor = playersColors[i].toLowerCase();
        }
    }
    renderCurrentPlayer(currentPlayer);
    rollBtn.disabled = false;
    document.getElementById('playGround').style.display = 'block';
};

function changeCurrentPlayer(){
    currentPlayer = (currentPlayer + 1) % parseInt(players.value);
    currentPlayer = currentPlayer == 0 ? parseInt(players.value) : currentPlayer;
    renderCurrentPlayer(currentPlayer);
};

function returnEnemyPawnToBase(pawnImg){
    var pawn = findPawnById(pawnImg.id);
    var parent = document.getElementById(pawn.position);
    var dest = document.getElementById(pawn.player + 'Base');
    parent.removeChild(pawnImg);
    dest.appendChild(pawnImg);
    pawn.position = dest.id;
};

function movePawn(pawn){
    var parent = document.getElementById(pawn.position);
    var myPawn = document.getElementById(pawn.id);
    var dest = getDest(pawn.position);
    var enemy = dest.childNodes[0];
    if(enemy !== undefined){
        if(enemy.className === 'pawnImage'){
            returnEnemyPawnToBase(enemy);
        }
    }
    parent.removeChild(myPawn);
    pawn.position = dest.id;
    dest.appendChild(myPawn);
    if (rollValue < 6){
        changeCurrentPlayer();
    }
    rollValue = null;
    rollResult.innerHTML = '';
    rollBtn.disabled = false;
    deselectPawns();

};

function moveCheck(){
    var result = false;
    for(var i = 0; i < listPawns.length; i += 1){
        if(listPawns[i].player === 'player' + currentPlayer){
            if(canMovePawn(listPawns[i])){
                result = true;
            }
        }
    }
    if(!result){
        alert('No available moves');
        rollValue = null;
        rollResult.innerHTML = '';
        rollBtn.disabled = false;
        changeCurrentPlayer();
    }
}

function playerTurn(){
    rollBtn.disabled = true;
    rollValue = rollDice();
    rollResult.innerHTML = rollValue;
    moveCheck();

};

document.getElementById('playBtn').addEventListener('click', play, false);
document.getElementById('selectColor').addEventListener('click', selectColor, false);
document.getElementById('rollDice').addEventListener('click', playerTurn, false);
initColors();
