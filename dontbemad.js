var players = document.getElementById('players');
var availableColors = ['Red', 'Blue', 'Green', 'Yellow'];
var playersColors = [];
var playgroundTable = document.createElement('table');

var setPlayerColor = function(num){
    initColors();
    document.getElementById('playerNumber').innerHTML = num;
    document.getElementById('chooseColor').style.display = 'block';
};


var play = function(){
    players.value = document.getElementById('players').value;
    document.getElementById('startInfo').style.display = 'none';
    setPlayerColor(1);

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
        displayPlayGround();
    }
};

function displayPlayGround(){
    for(var i = 1; i <= players.value; i += 1){
        var baseCell = document.getElementById('player' + i + 'Base');
        baseCell.style.backgroundColor = playersColors[i].toLowerCase();
    }
    document.getElementById('playGround').style.display = 'block';
};

document.getElementById('playBtn').addEventListener('click', play, false);
document.getElementById('selectColor').addEventListener('click', selectColor, false);
initColors();
