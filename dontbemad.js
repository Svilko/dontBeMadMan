var players = document.getElementById('players');
var availableColors = ['Red', 'Blue', 'Green', 'Yellow'];
var playersColors = [];
var listPawns = [];
var currentPlayer = 1;
var rollBtn = document.getElementById('rollDice');
var rollResult = document.getElementById('rollResult');
var movePawnBtn = document.getElementById('movePawnBtn');
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
};

var play = function(){
    players.value = document.getElementById('players').value;
    document.getElementById('startInfo').style.display = 'none';
    setPlayerColor(1);
};

function selectPawn(pawnImage){
    pawnImage.style.boxShadow = 'inset 0px 0px 0px 5px #000';

};

function clickImage(e){
    var pawn = findPawnById(e.currentTarget.id);
    if(!pawn.isSelected){
        selectPawn(e.currentTarget);
    }else {
        movePawn(pawn);
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
    movePawnBtn.disabled = true;
    document.getElementById('playGround').style.display = 'block';
};



function movePawn(pawn){
    rollResult.innerHTML = '';
    rollBtn.disabled = false;
    movePawnBtn.disabled = true;
    renderCurrentPlayer(currentPlayer);
};

function playerTurn(){
    rollBtn.disabled = true;
    var roll = rollDice();
    rollResult.innerHTML = roll;
    movePawnBtn.disabled = false;
    if (roll < 6){
        currentPlayer = (currentPlayer + 1) % 4;
        currentPlayer = currentPlayer == 0 ? 4 : currentPlayer;
    }
};

document.getElementById('playBtn').addEventListener('click', play, false);
document.getElementById('selectColor').addEventListener('click', selectColor, false);
document.getElementById('rollDice').addEventListener('click', playerTurn, false);
document.getElementById('movePawnBtn').addEventListener('click', movePawn, false);
initColors();
