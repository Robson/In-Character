var finishedLevel = false;
var playerIsDead = false;
var visibleDistanceHorizontal = 12;
var visibleDistanceVertical = 10;
var display = new Array(visibleDistanceVertical * 2 + 1).fill(0).map(a => new Array(visibleDistanceHorizontal * 2 + 1 + a));
var lettersOnGrid = new Array(visibleDistanceVertical * 2 + 1);
var offset = { x: 0, y: 0 };
var fixed = { x: 0, y: 0 };
var player = { x: 0, y: 0 };
var gravityTimer,
	level,
	levelHasGravity,
	availableLetters,
	playerSquares

function makeInitialTable() {
	$('table#level *').remove();
	for(var y = 0; y < display.length; y++) {
		var row = $('<tr>').appendTo('table#level');
		for(var x = 0; x < display[0].length; x++) {
			var square = $('<td>').appendTo(row);
			square.attr('id', y + '_' + x);
		}
	}
}

function startLevel(levelName) {
	level = levels[levelName].grid.slice(0);
	availableLetters = levels[levelName].startingLetters.split('');
	playerLetter = levels[levelName].initialLetter;
	playerSquares = letters[playerLetter];
	levelHasGravity = levels[levelName].gravity;
	offset.x = (playerSquares[0].length - 1) / 2;
	offset.y = (playerSquares.length - 1) / 2;
	player.x = levels[levelName].startingPosition.x;
	player.y = levels[levelName].startingPosition.y;	
	fixed.x = levels[levelName].fixed.x;
	fixed.y = levels[levelName].fixed.y;
	$('#levelComplete').css('display', 'none');
	finishedLevel = false;
	playerIsDead = false;
	updateArea();
	showAvailableLetters();
	if(gravityTimer != null) {
		clearInterval(gravityTimer);
	}
	if(levelHasGravity) {
		gravityTimer = setInterval('applyGravity()', 150);
	}
	if(levels[levelName].message == null) {
		$('#levelMessage').css('display', 'none');
	} else {
		$('#levelMessage').html("<p class='heading'>Level Hint</p><p>" + levels[levelName].message + '</p>');
		$('#levelMessage').css('display', 'block');		
	}
}

function applyGravity() {
	if(levelHasGravity && !finishedLevel) {
		movePlayer({ x: 0, y: 1 });
	}
}

function updateArea() {
	makeInitialDisplay();
	var start = {};
	start.x = fixed.x == null ? visibleDistanceHorizontal - offset.x : player.x - fixed.x;
	start.y = fixed.y == null ? visibleDistanceVertical - offset.y : player.y - fixed.y;
	for(var y = 0; y < playerSquares.length; y++) {
		for(var x = 0; x < playerSquares.length; x++) {
			if(playerSquares[y][x] == 1) {
				if(display[y + start.y][x + start.x] == "death") {
					display[y + start.y][x + start.x] = "deathPlayer";
				} else if(display[y + start.y][x + start.x] == "exit") {
					display[y + start.y][x + start.x] = "exitPlayer";
				} else {
					display[y + start.y][x + start.x] = "player";
				}
			}
		}
	}
	displayDataOnScreen();
}

function showFailedLetter(failedLetter) {
	makeInitialDisplay();
	var start = {};
	start.x = fixed.x == null ? visibleDistanceHorizontal - offset.x : player.x - fixed.x;
	start.y = fixed.y == null ? visibleDistanceVertical - offset.y : player.y - fixed.y;
	for(var y = 0; y < failedLetter.length; y++) {
		for(var x = 0; x < failedLetter.length; x++) {
			if(failedLetter[y][x] == 1) {
				display[y + start.y][x + start.x] += " failedPlayer";
			}
		}
	}
	displayDataOnScreen();
	setTimeout('updateArea()', 1000);
}

function makeInitialDisplay() {
	var start = {};
	start.x = fixed.x == null ? player.x - visibleDistanceHorizontal + offset.x : fixed.x;
	start.y = fixed.y == null ? player.y - visibleDistanceVertical + offset.y : fixed.y;
	for(var y = start.y; y <= start.y + visibleDistanceVertical * 2; y++) {
		lettersOnGrid[y - start.y] = new Array(visibleDistanceHorizontal * 2 + 1);
		for(var x = start.x; x <= start.x + visibleDistanceHorizontal * 2; x++) {
			var squareClass = "outside";
			if(x >= 0 && y >= 0 && y < level.length && x < level[0].length) {
				switch (level[y][x]) {
					case "0":
						squareClass = "empty";
						break;
					case "1":
						squareClass = "wall";
						break;
					case "2":
						squareClass = "exit";
						break;
					case "3":
						squareClass = "death";
						break;
					case "4":
						squareClass = "altWall";
						break;
					default:
						lettersOnGrid[y - start.y][x - start.x] = level[y][x];
						squareClass = "empty";
						break;
				}
			}
			display[y - start.y][x - start.x] = squareClass;
		}
	}
}

function displayDataOnScreen() {
	$('.temp').remove();
	for(var y = 0; y < display.length; y++) {
		for(var x = 0; x < display[0].length; x++) {
			var square = $('#' + y + "_" + x);
			square.attr("class", display[y][x]);
			var displayedLetter = false;
			if (!displayedLetter && lettersOnGrid[y][x] != null) {
				square.attr("class", square.attr("class") + " containsLetter" + (finishedLevel ? " fadedLetter" : ""));
				square.append("<div>");
				var div = $('#' + y + '_' + x + ' div')
				div.attr("class", "temp");
				div.html(lettersOnGrid[y][x]);
			}
		}
	}
}

function movePlayer(move) {
	for(var x = 0; x < letters['a'][0].length; x++) {
		for(var y = 0; y < letters['a'].length; y++) {
			if(playerSquares[y][x] == '1') {
				if(player.x + move.x + x < 0 || player.y + move.y + y < 0 || player.x + move.x + x >= level[0].length || player.y + move.y + y >= level.length) {
					return;
				} else {
					switch (level[player.y + move.y + y][player.x + move.x + x]) {
						case '1':
							return;
						case '4':
							return;
					}
				}
			}
		}
	}
	player.x += move.x;
	player.y += move.y;
	if(move.y < 1) {
		applyGravity();
	}
	checkLetterCollect();
	checkLose();
	checkWin();
	updateArea();
}

function changeLetter(letter) {
	var validLetter = true;
	for(var x = 0; x < letters["a"][0].length; x++) {
		for(var y = 0; y < letters["a"].length; y++) {
			if(letters[letter][y][x] == "1") {
				if(player.x + x < 0 || player.y + y < 0 || player.x + x >= level[0].length || player.y + y >= level.length) {
					validLetter = false;
				} else {
					switch (level[player.y + y][player.x + x]) {
						case "1":
						case "3":
						case "4":
							validLetter = false;
							break;
					}
				}
			}
		}
	}
	if(validLetter) {
		playerLetter = letter;
		playerSquares = letters[playerLetter];
		checkLetterCollect();
		updateArea();
		showAvailableLetters();
		checkWin();
	} else {
		showFailedLetter(letters[letter]);
	}
}

function checkLetterCollect() {
	var collectedLetter = false;
	for(var x = 0; x < letters["a"][0].length; x++) {
		for(var y = 0; y < letters["a"].length; y++) {
			if(playerSquares[y][x] == "1") {
				if(level[player.y + y][player.x + x] >= "a" && level[player.y + y][player.x + x] <= "z") {
					availableLetters.push(level[player.y + y][player.x + x]);
					availableLetters.sort();
					level[player.y + y] = replaceCharacter(level[player.y + y], player.x + x, "0");
					collectedLetter = true;
				}
			}
		}
	}
	if(collectedLetter) {
		showAvailableLetters();
	}
}

function checkLose() {
	var hasDied = false;
	for(var x = 0; x < letters["a"][0].length; x++) {
		for(var y = 0; y < letters["a"].length; y++) {
			if(playerSquares[y][x] == "1") {
				if(level[player.y + y][player.x + x] == "3") {
					hasDied = true;
				}
			}
		}
	}
	if (hasDied) {
		$('#levelComplete .heading').text('Level failed!');
		$('#levelComplete .body').text('Press space to restart.');
		$('#levelComplete').css('display', 'block');
		$('#levelComplete').addClass('levelFail');
		$('#levelComplete').removeClass('levelSuccess');
		finishedLevel = true;
		playerIsDead = true;
		updateArea();
	}
}

function checkWin() {
	for(var x = 0; x < letters["a"][0].length; x++) {
		for(var y = 0; y < letters["a"].length; y++) {
			if(playerSquares[y][x] == "1") {
				if(level[player.y + y][player.x + x] != "2") {
					return;
				}
			}
		}
	}
	$('#levelComplete .heading').text('Level complete!');
	$('#levelComplete .body').text('Press space to continue.');
	$('#levelComplete').css('display', 'block');		
	$('#levelComplete').removeClass('levelFail');
	$('#levelComplete').addClass('levelSuccess');
	finishedLevel = true;
	updateArea();
}

function showAvailableLetters() {
	var h = "";
	for(var i = 0; i < availableLetters.length; i++) {
		h += "<div>" + letterToTable(availableLetters[i]) + "</div>";
	}
	$('#letters').html(h);
}

function letterToTable(letter) {
	var table = "<table cellspacing='0' class='letter'>";
	for(var y = 0; y < letters[letter].length; y++) {
		table += "<tr>";
		for(var x = 0; x < letters[letter][0].length; x++) {
			if(letters[letter][y][x] == 1) {
				if(letter == playerLetter) {
					table += "<td class='onplayer'></td>";
				} else {
					table += "<td class='on'></td>";
				}
			} else {
				table += "<td class='off'></td>";
			}
		}
		table += "</tr>";
	}
	table += "</table>";
	return table;
}

function getListValue(listName) {
	return document.getElementById(listName).options[document.getElementById(listName).selectedIndex].text;
}

function replaceCharacter(text, index, character) {
	return text.substr(0, index) + character + text.substr(index + character.length);
}

function levelSelectChanged() {
	startLevel(getListValue("levelSelect"));
	$("#levelSelect").blur();
}

function pressedSpace() {
	var index = document.getElementById("levelSelect").selectedIndex;
	var max = document.getElementById("levelSelect").options.length;
	if(!playerIsDead && finishedLevel) {
		index++;
	}
	if(index < max) {
		document.getElementById("levelSelect").selectedIndex = index;
		levelSelectChanged();
	}	
}

function pressedLetter(keyCode) {
	var character = String.fromCharCode(keyCode).toLowerCase();
	if(availableLetters.includes(character)) {
		changeLetter(character);
	}	
}

function unifyKeyCodes(keyCode) {
	if (keyCode == KeyEvent.DOM_VK_NUMPAD4) {
		keyCode = KeyEvent.DOM_VK_LEFT;
	} else if (keyCode == KeyEvent.DOM_VK_NUMPAD6) {
		keyCode = KeyEvent.DOM_VK_RIGHT;
	} else if (keyCode == KeyEvent.DOM_VK_NUMPAD8) {
		keyCode = KeyEvent.DOM_VK_UP;
	} else if (keyCode == KeyEvent.DOM_VK_NUMPAD2 || keyCode == KeyEvent.DOM_VK_NUMPAD5) {
		keyCode = KeyEvent.DOM_VK_DOWN;
	}
	return keyCode;				
}

$(document).ready(function() {
	$(document).keydown(function(key) {
		var keyCode = parseInt(key.which, 10);
		if(keyCode == KeyEvent.DOM_VK_SPACE) {
			pressedSpace();
		}
		if(!finishedLevel) {
			if(keyCode >= KeyEvent.DOM_VK_A && keyCode <= KeyEvent.DOM_VK_Z) {
				pressedLetter(keyCode);
			} else {
				switch (unifyKeyCodes(keyCode)) {
					case KeyEvent.DOM_VK_LEFT:
						movePlayer({ x: -1, y: 0 });
						key.preventDefault();
						break;
					case KeyEvent.DOM_VK_RIGHT:
						movePlayer({ x: 1, y: 0 });
						key.preventDefault();
						break;
					case KeyEvent.DOM_VK_UP:
						if(!levelHasGravity) {
							movePlayer({ x: 0, y: -1 });
							key.preventDefault();
						}
						break;
					case KeyEvent.DOM_VK_DOWN:
						if(!levelHasGravity) {
							movePlayer({ x: 0, y: 1 });
							key.preventDefault();
						}
						break;
				}
			}
		}
	});
});

function isUsed(a) {
	return a;
}

isUsed(KeyEvent);

makeInitialTable();
startLevel(levelNames[0]);
document.getElementById("levelSelect").onchange = levelSelectChanged;
document.getElementById("levelSelect").onkeyup = levelSelectChanged;
document.getElementById("levelSelect").selectedIndex = 0;