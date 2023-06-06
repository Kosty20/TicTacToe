document.addEventListener('DOMContentLoaded', startGame);

let turnX = true;
let mode = '';
let backIndex = 0;

function startGame() {
	eventHandlers();
}

function eventHandlers() {
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

	const btns = [btn0, btn2, btn3, btn4];
	btns.forEach((btn) => {
		btn.addEventListener('click', () => {
			startMenu.classList.add('hidden');
			playArea.classList.remove('hidden');
		});
	});

	//playArea
	const board = document.querySelector('[data-board]');
	[...board.children].forEach((div) => {
		div.addEventListener('click', () => manageModes(div), { once: true });
	});

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

function manageModes(target) {
	switch (mode) {
		case 'PvP':
			enablePvP(target);
			break;
		
	}
}

function enablePvP(target) {
	if (turnX) {
		buildX(target);
		target.classList.add('X');
		turnX = false;
	} else {
		buildO(target);
		target.classList.add('O');
		turnX = true;
	}
	checkWinner();
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
