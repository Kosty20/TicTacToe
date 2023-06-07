document.addEventListener('DOMContentLoaded', load);

let turnX = true;
let mode = '';
let pvcCharacter = 'X';
let backIndex = 0;

function load() {
	onLoadHandlers();
}

function onLoadHandlers() {
	const startMenu = document.querySelector('#startMenu');
	const playArea = document.querySelector('#playArea');

	//startMenu
	const p = document.querySelector('[data-p]');
	const back = document.querySelector('[data-back]');
	const btn0 = document.querySelector('[data-pvp-btn]');
	const btn1 = document.querySelector('[data-pvc-btn]');
	const btn2 = document.querySelector('[data-easy-btn]');
	const btn3 = document.querySelector('[data-hard-btn]');
	const btn4 = document.querySelector('[data-impos-btn]');

	window.addEventListener(
		'click',
		() => {
			toggleHidden(p);
			toggleModeBtns();
		},
		{ once: true }
	);

	back.addEventListener('click', () => {
		if (backIndex === 1) {
			toggleDifficultyBtns();
			toggleModeBtns();
			backIndex--;
			toggleHidden(back);
		}
	});

	btn1.addEventListener('click', () => {
		toggleHidden(back);
		toggleModeBtns();
		toggleDifficultyBtns();
		backIndex++;
	});

	btn0.onclick = () => (mode = 'PvP');
	btn2.onclick = () => (mode = 'PvC-Easy');
	btn3.onclick = () => (mode = 'PvC-Hard');
	btn4.onclick = () => (mode = 'PvC-Impos');

	[btn0, btn2, btn3, btn4].forEach((btn) => {
		btn.addEventListener('click', () => {
			startMenu.classList.add('hidden');
			playArea.classList.remove('hidden');
			startGame();
		});
	});

	//playArea

	//auxiliaries
	function toggleHidden(target) {
		target.classList.toggle('hidden');
	}
	function toggleModeBtns() {
		[btn0, btn1].forEach(toggleHidden);
	}
	function toggleDifficultyBtns() {
		[btn2, btn3, btn4].forEach(toggleHidden);
	}
}

const squares = document.querySelectorAll('[data-board] > div');

function startGame() {
	switch (mode) {
		case 'PvP':
			enablePvP();
			break;
		case 'PvC-Easy':
			enablePvCEasy();
			break;
		case 'PvC-Hard':
			enablePvCHard();
			break;
		case 'PvC-Impos':
			enablePvCImpos();
			break;
	}
}

function enablePvP() {
	squares.forEach((square) => {
		square.addEventListener('click', () => {
			if (!square.childElementCount) {
				//
				if (turnX) {
					addXSwitchTurn(square);
				} else {
					addOSwitchTurn(square);
				}
				checkWinner();
				//
			}
		});
	});
}

function enablePvCEasy() {
	if (pvcCharacter === 'O') addRandomX();
	squares.forEach((square) => {
		square.addEventListener('click', () => {
			if (!square.childElementCount) {
				//
				if (pvcCharacter === 'X') {
					addXSwitchTurn(square);
					addRandomO();
				} else {
					addOSwitchTurn(square);
					addRandomX();
				}
				//
			}
		});
	});
}

function enablePvCHard() {}

function enablePvCImpos() {}

function addRandomO() {
	const luckyDiv = squares[randomNum(9)];
	if (!luckyDiv.childElementCount) {
		addOSwitchTurn(luckyDiv);
		return;
	}
	if (spaceAvalabile()) addRandomO();
}

function addRandomX() {
	const luckyDiv = squares[randomNum(9)];
	if (!luckyDiv.childElementCount) {
		addXSwitchTurn(luckyDiv);
		return;
	}
	addRandomX();
}

function spaceAvalabile() {
	for (let i = 0; i <= 8; i++) {
		if (!squares[i].childElementCount) return 1;
	}
}

function randomNum(max) {
	return Math.floor(Math.random() * max);
}

function addXSwitchTurn(target) {
	buildX(target);
	target.classList.add('X');
	turnX = false;
}

function addOSwitchTurn(target) {
	buildO(target);
	target.classList.add('O');
	turnX = true;
}

function checkWinner() {
	const divs = document.querySelectorAll('.board > div');

	if (matched()) {
		console.log('winner');
	}

	function matched() {
		if (
			checkDivs(0, 1, 2) ||
			checkDivs(3, 4, 5) ||
			checkDivs(6, 7, 8) ||
			checkDivs(0, 3, 6) ||
			checkDivs(1, 4, 7) ||
			checkDivs(2, 5, 8) ||
			checkDivs(0, 4, 8) ||
			checkDivs(2, 4, 6)
		) {
			return true;
		}
	}

	function checkDivs(a, b, c) {
		if (
			divs[a].className &&
			divs[a].className === divs[b].className &&
			divs[b].className === divs[c].className
		) {
			return true;
		}
	}
}

function buildX(target) {
	const div1 = document.createElement('div');
	const div2 = document.createElement('div');
	div1.classList.add('x-line');
	div2.classList.add('x-line');

	target.append(div1, div2);
}

function buildO(target) {
	const div = document.createElement('div');
	div.classList.add('o-div');
	target.append(div);
}
