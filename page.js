var finishedLevel = false;
var playerIsDead = false;
var visibleDistanceHorizontal = 12;
var visibleDistanceVertical = 10;
var gravityTimer;
var display = new Array(visibleDistanceVertical * 2 + 1);
for(var i = 0; i < display.length; i++) {
	display[i] = new Array(visibleDistanceHorizontal * 2 + 1);
}
var lettersOnGrid = new Array(visibleDistanceVertical * 2 + 1);
for(var i = 0; i < lettersOnGrid.length; i++) {
	lettersOnGrid[i] = new Array(visibleDistanceHorizontal * 2 + 1);
}
var level,
	levelHasGravity,
	availableLetters,
	playerLetters,
	player,
	playerX, playerY,
	offsetX, offsetY,
	fixedX, fixedY;

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
	availableLetters = levels[levelName].startingLetters;
	playerLetter = levels[levelName].initialLetter;
	player = letters[playerLetter];
	offsetX = (player[0].length - 1) / 2;
	offsetY = (player.length - 1) / 2;
	playerX = levels[levelName].startingPosition.x;
	playerY = levels[levelName].startingPosition.y;
	levelHasGravity = levels[levelName].gravity;
	fixedX = levels[levelName].fixedX;
	fixedY = levels[levelName].fixedY;
	$('#levelComplete').css('display', 'none');
	finishedLevel = false;
	playerIsDead = false;
	updateArea(true);
	showAvailableLetters();
	if(gravityTimer != null) {
		clearInterval(gravityTimer);
	}
	if(levelHasGravity) {
		gravityTimer = setInterval('applyGravity()', 150);
	}
	if(levels[levelName].message != null) {
		$('#levelMessage').html("<p class='heading'>Level Hint</p><p>" + levels[levelName].message + '</p>');
		$('#levelMessage').css('display', 'block');
	} else {
		$('#levelMessage').css('display', 'none');
	}
}

function applyGravity() {
	if(levelHasGravity) {
		if(!finishedLevel) {
			movePlayer(0, 1);
		}
	}
}

function updateArea(displayArea) {
	makeInitialDisplay();
	var startX = visibleDistanceHorizontal - offsetX;
	var startY = visibleDistanceVertical - offsetY;
	if(fixedX != null) {
		startX = playerX - fixedX;
	}
	if(fixedY != null) {
		startY = playerY - fixedY;
	}
	for(var y = 0; y < player.length; y++) {
		for(var x = 0; x < player.length; x++) {
			if(player[y][x] == 1) {
				if(display[y + startY][x + startX] == "death") {
					display[y + startY][x + startX] = "deathPlayer";
				} else if(display[y + startY][x + startX] == "exit") {
					display[y + startY][x + startX] = "exitPlayer";
				} else {
					display[y + startY][x + startX] = "player";
				}
			}
		}
	}
	if(displayArea) {
		displayDataOnScreen();
	}
}

function showFailedLetter(failedLetter) {
	makeInitialDisplay();
	var startX = visibleDistanceHorizontal - offsetX;
	var startY = visibleDistanceVertical - offsetY;
	if(fixedX != null) {
		startX = playerX - fixedX;
	}
	if(fixedY != null) {
		startY = playerY - fixedY;
	}
	for(var y = 0; y < failedLetter.length; y++) {
		for(var x = 0; x < failedLetter.length; x++) {
			if(failedLetter[y][x] == 1) {
				display[y + startY][x + startX] += " failedPlayer";
			}
		}
	}
	displayDataOnScreen();
	setTimeout(function() {
		updateArea(true)
	}, 1000);
}

function makeInitialDisplay() {
	var startX = playerX - visibleDistanceHorizontal + offsetX;
	var startY = playerY - visibleDistanceVertical + offsetY;
	if(fixedX != null) {
		startX = fixedX;
	}
	if(fixedY != null) {
		startY = fixedY;
	}
	for(var y = startY; y <= startY + visibleDistanceVertical * 2; y++) {
		lettersOnGrid[y - startY] = new Array(visibleDistanceHorizontal * 2 + 1);
		for(var x = startX; x <= startX + visibleDistanceHorizontal * 2; x++) {
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
						lettersOnGrid[y - startY][x - startX] = level[y][x];
						squareClass = "empty";
						break;
				}
			}
			display[y - startY][x - startX] = squareClass;
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
			if (displayedLetter == false && lettersOnGrid[y][x] != null) {
				if(finishedLevel) {
					square.attr("class", square.attr("class") + " containsLetter fadedLetter");
				} else {
					square.attr("class", square.attr("class") + " containsLetter");
				}
				square.append("<div>");
				var div1 = $('#' + y + '_' + x + ' div')
				div1.attr("class", "temp");
				div1.html(lettersOnGrid[y][x]);
			}
		}
	}
}

function movePlayer(moveX, moveY) {
	for(var x = 0; x < letters['a'][0].length; x++) {
		for(var y = 0; y < letters['a'].length; y++) {
			if(player[y][x] == '1') {
				if(playerX + moveX + x < 0 || playerY + moveY + y < 0 || playerX + moveX + x >= level[0].length || playerY + moveY + y >= level.length) {
					return;
				} else {
					switch (level[playerY + moveY + y][playerX + moveX + x]) {
						case '1':
							return;
						case '4':
							return;
					}
				}
			}
		}
	}
	playerX += moveX;
	playerY += moveY;
	if(moveY <= 0) {
		applyGravity();
	}
	checkLetterCollect();
	checkLose();
	checkWin();
	updateArea(true);
}

function changeLetter(letter) {
	var validLetter = true;
	for(var x = 0; x < letters["a"][0].length; x++) {
		for(var y = 0; y < letters["a"].length; y++) {
			if(letters[letter][y][x] == "1") {
				if(playerX + x < 0 || playerY + y < 0 || playerX + x >= level[0].length || playerY + y >= level.length) {
					validLetter = false;
				} else {
					switch (level[playerY + y][playerX + x]) {
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
		player = letters[playerLetter];
		checkLetterCollect();
		updateArea(true);
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
			if(player[y][x] == "1") {
				if(level[playerY + y][playerX + x] >= "a" && level[playerY + y][playerX + x] <= "z") {
					availableLetters += level[playerY + y][playerX + x];
					availableLetters = sortString(availableLetters);
					level[playerY + y] = replaceCharacter(level[playerY + y], playerX + x, "0");
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
			if(player[y][x] == "1") {
				if(level[playerY + y][playerX + x] == "3") {
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
		updateArea(true);
	}
}

function checkWin() {
	for(var x = 0; x < letters["a"][0].length; x++) {
		for(var y = 0; y < letters["a"].length; y++) {
			if(player[y][x] == "1") {
				if(level[playerY + y][playerX + x] != "2") {
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
	updateArea(true);
}

function showAvailableLetters() {
	var h = "";
	for(var i = 0; i < availableLetters.length; i++) {
		h += "<div>" + letterToTable(availableLetters[i]) + "</div>";
	}
	$('#letters').html('<p>' + h + '</p>');
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

function sortString(text) {
	var individualLetters = text.split('');
	individualLetters.sort(function(x, y) {
		return x > y ? 1 : (x < y ? -1 : 0);
	});
	return individualLetters.join('');
}

function levelSelectChanged() {
	startLevel(getListValue("levelSelect"));
	$("#levelSelect").blur();
}
$(document).ready(function() {
	$(document).keydown(function(key) {
		var keyCode = parseInt(key.which, 10);
		if(keyCode == KeyEvent.DOM_VK_SPACE) {
			var index = document.getElementById("levelSelect").selectedIndex;
			var max = document.getElementById("levelSelect").options.length;
			if(playerIsDead == false && finishedLevel == true) {
				index++;
			}
			if(index < max) {
				document.getElementById("levelSelect").selectedIndex = index;
				levelSelectChanged();
			}
		}
		if(!finishedLevel) {
			if(keyCode >= KeyEvent.DOM_VK_A && keyCode <= KeyEvent.DOM_VK_Z) {
				var character = String.fromCharCode(keyCode).toLowerCase();
				if(availableLetters.indexOf(character) >= 0) {
					changeLetter(character);
				}
			} else {
				switch (keyCode) {
					case KeyEvent.DOM_VK_LEFT:
					case KeyEvent.DOM_VK_NUMPAD4:
						movePlayer(-1, 0);
						key.preventDefault();
						break;
					case KeyEvent.DOM_VK_RIGHT:
					case KeyEvent.DOM_VK_NUMPAD6:
						movePlayer(1, 0);
						key.preventDefault();
						break;
					case KeyEvent.DOM_VK_UP:
					case KeyEvent.DOM_VK_NUMPAD8:
						if(levelHasGravity == false) {
							movePlayer(0, -1);
							key.preventDefault();
						}
						break;
					case KeyEvent.DOM_VK_DOWN:
					case KeyEvent.DOM_VK_NUMPAD2:
					case KeyEvent.DOM_VK_NUMPAD5:
						if(levelHasGravity == false) {
							movePlayer(0, 1);
							key.preventDefault();
						}
						break;
				}
			}
		}
	});
});
makeInitialTable();
startLevel(levelNames[0]);
document.getElementById("levelSelect").onchange = levelSelectChanged;
document.getElementById("levelSelect").onkeyup = levelSelectChanged;
document.getElementById("levelSelect").selectedIndex = 0;