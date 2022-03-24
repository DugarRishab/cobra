window.addEventListener("load", () => {
	determineGrid();
	unitManager();
	window.addEventListener("resize", () => {
		determineGrid();
		//moveUnit();
	});


});

const fruits = ['apple', 'mango', 'banana', 'cherry', 'pineapple', 'strawberry'];
const points = [10, 50, 10, 20, 20, 100];
const speed = 20; // in ms // time to travel 1px


const numberOfFruits = () => {
	
}
const determineGrid = () => {
	let screenWidth = window.innerWidth;
	let screenHeight = window.innerHeight - (window.innerHeight / 10);

	let columns, rows;

	for (let i = 0; i < 40; i++){
		if ((screenWidth - i) % 40 === 0) {
			rows = (screenWidth - i - 5) / 40;
		}
		if ((screenHeight - i) % 40 === 0) {
			columns = (screenHeight - i - 5) / 40;
		}
	}

	const gameBody = document.querySelector(".game-body");
	gameBody.style.width = `${rows * 40}px`;
	gameBody.style.height = `${columns * 40}px`;
	// gameBody.style.margin = 'auto';
}

function forEachWithCallback(callback) {
	const arrayCopy = this;
	let index = 0;
	const next = () => {
		index++;
		if (arrayCopy.length > 0) {
			callback(arrayCopy.shift(), index, next);
		}
	}
	next();
}
Array.prototype.forEachWithCallback = forEachWithCallback;

const createTurn = (turns) => {
	window.addEventListener("keyup", (e) => {
		console.log(e.key);
		console.log(e.code);
	})
}

const moveUnit = async (unit) => {
	const gameBody = document.querySelector(".game-body");
	const snake = document.querySelector(".snake");
	//const units = snake.querySelectorAll(".unit");
	console.log('unit', unit);
	
	// units.forEach(unit => {
	// 	unit.turns = turns;
	// 	console.log(unit);
	// });
	const turns = [
		{
			id: 1,
			direction: "right",
			axis: 'x',
			position: 10000
		}
	];

	//createTurn(turns);

	//console.log("turns", turns);

	let xp = +(unit.style.left.split('p')[0]);
	let yp = +(unit.style.top.split('p')[0]);

	//console.log(unit.style.left);

	await turns.forEachWithCallback((turn, i, next) => {
		
		if (turn.axis === 'x') {
			const interval = setInterval(() => {
				//console.log("moving...");
					
				xp = xp + ((turn.position - xp) / Math.abs(turn.position - xp));
				//console.log("moving...", xp);
				unit.style.left = xp + 'px';
				if (xp == turn.position) {
					clearInterval(interval);
					next();
				}
			}, speed);
		}
		if (turn.axis === 'y') {
			const interval = setInterval(() => {
				//console.log("moving...");
					
				yp = yp + ((turn.position - yp) / Math.abs(turn.position - yp));
				//console.log("moving...", yp);
				unit.style.top = yp + 'px';
				if (yp == turn.position) {
					clearInterval(interval);
					next();
				}
			}, speed);
		}
		
		window.addEventListener("keyup", (e) => {
			if (e.code === 'ArrowDown') {
				turns.push({
					axis: 'y',
					position: 100000
				});
				console.log('turns: ', turns);
				if (unit.getAttribute('id') == 'unit1') {
					turns[turns.length - 2].position = xp;
				}
			}
			console.log(e.code);
			
		
		});
		


	});
	
	
}
const unitManager = () => {
	const gameBody = document.querySelector(".game-body");
	const snake = document.querySelector(".snake");
	const units = snake.querySelectorAll(".unit");

	// positioningUnit();

	units.forEach(unit => {

		console.log(unit.style);
		moveUnit(unit);
	});
}
// const positioningUnit = () => {
// 	const snake = document.querySelector(".snake");
// 	const units = snake.querySelectorAll(".unit");

// 	let initialPosition = 0;
// 	units.forEach(unit => {

// 		unit.style.left = `${initialPosition * 30}px`;
// 		initialPosition++;
// 		console.log(unit.style);
// 		moveUnit(unit);
// 	});

// }