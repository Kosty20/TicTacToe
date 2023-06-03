window.addEventListener('click', startGame, { once: true });
const btns = document.querySelector('[data-btns]');

function startGame() {
	const p = document.querySelector('[data-p]');
    p.classList.add('shrink');

	const vsP = buildBtn('vs Player');
	const vsC = buildBtn('vs Computer');

	vsP.addEventListener('click', clearWindow)

	vsC.addEventListener('click', () => {
		vsP.remove();
		vsC.remove();

		const easy = buildBtn('Easy');
		const medium = buildBtn('Normal');
		const hard = buildBtn('Hard');

		btns.append(easy, medium, hard);
	})

	btns.append(vsP, vsC);
}

function clearWindow (){
	[...document.body.children].forEach(elmt => {
		elmt.remove();
	})
}

function buildBoard () {
	const container = document.createElement('div');
	container.classList.add('container');

	for(let i = 1; i <= 9; i++){
		const div = document.createElement('div');

		

		container.append(div);
	}
}

function buildBtn(text, cls) {
	const btn = document.createElement('button');
	btn.className = cls || '';
	btn.textContent = text;
	return btn;
}
