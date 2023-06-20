document.addEventListener('DOMContentLoaded', load);

function load() {
	onLoadHandlers();
}

function onLoadHandlers() {
	const startMenu = document.querySelector('#startMenu');
	const game = document.querySelector('#game');

	//startMenu
	const p = document.querySelector('[data-p]');
	const back = document.querySelector('[data-back]');
	const symbolPick = document.querySelector('[data-symbolPick]');
	const btn0 = document.querySelector('[data-pvp-btn]');
	const btn1 = document.querySelector('[data-pvc-btn]');
	const btn2 = document.querySelector('[data-easy-btn]');
	const btn3 = document.querySelector('[data-hard-btn]');
	const btn4 = document.querySelector('[data-impos-btn]');

	let backIndex = 0;
	let mode;
	let startingPlayer = 1;

	window.addEventListener(
		'click',
		() => {
			toggleHidden(p);
			[btn0, btn1].forEach(toggleHidden);
		},
		{ once: true }
	);

	back.addEventListener('click', () => {
		goBack();
	});

	btn1.addEventListener('click', () => {
		toggleHidden(back);
		toggleBtns();
		backIndex++;
	});

	[btn0, btn2, btn3, btn4].forEach((btn, index) => {
		btn.addEventListener('click', () => {
			toggleSection();
			mode = index;

			goBack();
		});
	});

	symbolPick.addEventListener('click', () => {
		startingPlayer = startingPlayer ? 0 : 1;
		symbolPick.textContent = startingPlayer ? 'X' : 'O';
	});

	btn0.onclick = () => NewGame().PvP();
	btn2.onclick = () => NewGame().PvC(1, startingPlayer);
	btn3.onclick = () => NewGame().PvC(5, startingPlayer);
	btn4.onclick = () => NewGame().PvC(-1, startingPlayer);

	//play area
	const gameEnd = document.querySelector('[data-gameEnd]');
	const paused = document.querySelector('[data-paused]');

	const pauseBtn = document.querySelector('[data-pause]');
	const restartBtn = document.querySelector('[data-restart]');
	const backToMenu = document.querySelectorAll('[data-toMenu]');
	const resume = document.querySelector('[data-resume]');

	restartBtn.addEventListener('click', () => {
		closeGame();

		switch (mode) {
			case 0:
				NewGame().PvP();
				break;
			case 1:
				NewGame().PvC(1);
				break;
			case 2:
				NewGame().PvC(5);
				break;
			case 3:
				NewGame().PvC(-1);
				break;
		}

		gameEnd.close();
	});

	backToMenu.forEach((btn) => {
		btn.addEventListener('click', () => {
			toggleSection();
			gameEnd.close();
			paused.close();

			closeGame();
		});
	});

	pauseBtn.addEventListener('click', () => {
		paused.showModal();
	});

	resume.addEventListener('click', () => {
		paused.close();
	});

	//auxiliaries
	function toggleHidden(target) {
		target.classList.toggle('hidden');
	}
	function toggleBtns() {
		toggleHidden(btn0);
		toggleHidden(btn1);
		toggleHidden(symbolPick);
		toggleHidden(btn2);
		toggleHidden(btn3);
		toggleHidden(btn4);
	}
	function toggleSection() {
		toggleHidden(startMenu);
		toggleHidden(game);
	}
	function goBack() {
		if (backIndex === 1) {
			toggleBtns();
			toggleHidden(back);
			backIndex--;
		}
	}
	function closeGame() {
		const cells = document.querySelectorAll('#board > div');
		cells.forEach((cell) => {
			cell.remove();
		});
	}
}

function NewGame() {
	const board = Board();

	const boardDiv = document.querySelector('#board');
	const cells = [];

	const line = boardDiv.querySelector('span');
	line.className = '';
	line.style = '';

	for (let i = 1; i <= 9; i++) {
		const cell = document.createElement('div');
		cells.push(cell);
		boardDiv.append(cell);
	}

	function PvP() {
		let playerTurn = 1;

		cells.forEach((cell, index) => {
			cell.addEventListener('click', () => {
				if (cell.className || board.isTerminal()) return;

				board.addSymbol(playerTurn, index, cell);

				if (board.isTerminal()) {
					_drawWinningLine(board.isTerminal());
					_showGameEndDialog();
				}

				playerTurn = playerTurn ? 0 : 1;
			});
		});
	}

	function PvC(difficulty, startingPlayer = 1) {
		const computer = AIPlayer(difficulty);
		let playerTurn = 1;

		if (!startingPlayer) {
			const firstChoice = Math.floor(Math.random() * 5) * 2; //center or corner index;
			board.addSymbol(playerTurn, firstChoice, cells[firstChoice]);
			playerTurn = playerTurn ? 0 : 1;
		}

		cells.forEach((cell, index) => {
			cell.addEventListener('click', () => {
				//PLAYER INPUT
				if (cell.className || board.isTerminal() || playerTurn !== startingPlayer) return;
				board.addSymbol(playerTurn, index, cell);
				if (board.isTerminal()) {
					_drawWinningLine(board.isTerminal());
					_showGameEndDialog();
				}
				playerTurn = playerTurn ? 0 : 1;

				//AI INPUT
				computer.getBestMove(board, !startingPlayer, (best) => {
					board.addSymbol(playerTurn, +best, cells[+best]);
					if (board.isTerminal()) {
						_drawWinningLine(board.isTerminal());
						_showGameEndDialog();
					}
					playerTurn = playerTurn ? 0 : 1;
				});
			});
		});
	}

	function _drawWinningLine(terminalBoard) {
		const { winner, direction, row, column, diagonal } = terminalBoard;
		if (winner === 'draw') return;
	
		const line = document.querySelector('#board > span');
		line.classList.add(`${direction}-${row || column || diagonal}`);
		line.style.width = row || column ? '95%' : diagonal ? '110%' : '0';
	}

	function _showGameEndDialog() {
		const dialog = document.querySelector('dialog');
		dialog.showModal();
	}

	return {
		PvP,
		PvC,
	};
}

function Board(state = ['', '', '', '', '', '', '', '', '']) {
	function insert(symbol, pos) {
		if (pos < 0 || pos > 8) {
			return console.error('Cell index does not exist');
		}
		if (symbol !== 'o' && symbol !== 'x') {
			return console.error('The symbol can only be x or o');
		}
		if (this.state[pos]) {
			return;
		}
		this.state[pos] = symbol;
	}

	function getAvalabileMoves() {
		const moves = [];
		this.state.forEach((cell, index) => {
			if (!cell) moves.push(index);
		});
		return moves;
	}

	//The every helper will return true if every iteration returned true
	function isEmpty() {
		return this.state.every((cell) => !cell);
	}
	function isFull() {
		return this.state.every((cell) => cell);
	}
	function isTerminal() {
		if (this.isEmpty()) return false;

		//Horizontal wins
		if (this.state[0] && this.state[0] === this.state[1] && this.state[0] === this.state[2]) {
			return { winner: this.state[0], direction: 'H', row: 1 };
		}
		if (this.state[3] && this.state[3] === this.state[4] && this.state[3] === this.state[5]) {
			return { winner: this.state[3], direction: 'H', row: 2 };
		}
		if (this.state[6] && this.state[6] === this.state[7] && this.state[6] === this.state[8]) {
			return { winner: this.state[6], direction: 'H', row: 3 };
		}

		//Vertical wins
		if (this.state[0] && this.state[0] === this.state[3] && this.state[0] === this.state[6]) {
			return { winner: this.state[0], direction: 'V', column: 1 };
		}
		if (this.state[1] && this.state[1] === this.state[4] && this.state[1] === this.state[7]) {
			return { winner: this.state[1], direction: 'V', column: 2 };
		}
		if (this.state[2] && this.state[2] === this.state[5] && this.state[2] === this.state[8]) {
			return { winner: this.state[2], direction: 'V', column: 3 };
		}

		//Diagonal wins
		if (this.state[0] && this.state[0] === this.state[4] && this.state[0] === this.state[8]) {
			return { winner: this.state[0], direction: 'D', diagonal: 'main' };
		}
		if (this.state[2] && this.state[2] === this.state[4] && this.state[2] === this.state[6]) {
			return { winner: this.state[2], direction: 'D', diagonal: 'counter' };
		}

		if (this.isFull()) return { winner: 'draw' };

		return false;
	}

	function addSymbol(turn, index, container) {
		if (turn) {
			_addX(container);
			this.insert('x', index);
		} else {
			_addO(container);
			this.insert('o', index);
		}
	}

	//Aux
	function _addX(target) {
		const div1 = document.createElement('div');
		div1.classList.add('x-line');

		const div2 = document.createElement('div');
		div2.classList.add('x-line');

		target.append(div1, div2);
		target.classList.add('X');
	}

	function _addO(target) {
		const div = document.createElement('div');
		div.classList.add('o-div');

		target.append(div);
		target.classList.add('O');
	}

	return {
		state,
		isEmpty,
		isFull,
		isTerminal,
		insert,
		getAvalabileMoves,
		addSymbol,
	};
}

function AIPlayer(maxDepth = -1) {
	const nodesMap = new Map();

	function getBestMove(board, maximizing = true, callback = () => {}, depth = 0) {
		//Clear the map if theres a new move to be made
		if (depth === 0) this.nodesMap.clear();

		//if the board is terminal, return a minmax
		if (board.isTerminal() || depth === this.maxDepth) {
			if (board.isTerminal().winner === 'x') {
				return 100 - depth;
			} else if (board.isTerminal().winner === 'o') {
				return -100 + depth;
			}
			return 0;
		}

		if (maximizing) {
			let best = -100;
			//loop through all empty cells
			board.getAvalabileMoves().forEach((index) => {
				//get current board copy
				const copy = Board([...board.state]);
				//create imaginary  move
				copy.insert('x', index);
				//constantly updating best value
				const nodeValue = this.getBestMove(copy, false, callback, depth + 1);
				best = Math.max(best, nodeValue);

				//in the main call, pair best value with the avalabile moves
				if (depth === 0) {
					const moves = this.nodesMap.has(nodeValue)
						? `${this.nodesMap.get(nodeValue)}, ${index}`
						: index;
					this.nodesMap.set(nodeValue, moves);
				}
			});
			//in main call, return index of the best move
			if (depth === 0) {
				let returnVal;
				if (typeof this.nodesMap.get(best) === 'string') {
					const arr = this.nodesMap.get(best).split(',');
					const rand = Math.floor(Math.random() * arr.length);
					returnVal = arr[rand];
				} else {
					returnVal = this.nodesMap.get(best);
				}
				callback(returnVal);
				return returnVal;
			}
			return best;
		}

		if (!maximizing) {
			let best = 100;
			board.getAvalabileMoves().forEach((index) => {
				const copy = Board([...board.state]);
				copy.insert('o', index);
				const nodeValue = this.getBestMove(copy, true, callback, depth + 1);
				best = Math.min(best, nodeValue);

				if (depth === 0) {
					const moves = this.nodesMap.has(nodeValue)
						? `${this.nodesMap.get(nodeValue)}, ${index}`
						: index;
					this.nodesMap.set(nodeValue, moves);
				}
			});
			if (depth === 0) {
				let returnVal;
				if (typeof this.nodesMap.get(best) === 'string') {
					const arr = this.nodesMap.get(best).split(',');
					const rand = Math.floor(Math.random() * arr.length);
					returnVal = arr[rand];
				} else {
					returnVal = this.nodesMap.get(best);
				}
				callback(returnVal);
				return returnVal;
			}
			return best;
		}
	}

	return {
		maxDepth,
		nodesMap,
		getBestMove,
	};
}
