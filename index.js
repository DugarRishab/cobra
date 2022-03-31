window.addEventListener("load", () => {
	determineGrid();
	//unitManager();
	//speedIncrementor();
	numberOfFruits();
	moveHead();
	moveUnit();
	window.addEventListener("resize", () => {
		determineGrid();
		//moveUnit();
	});

	//speedIncrementor();

});

const fruits = ['apple', 'mango', 'banana', 'cherry', 'pineapple', 'strawberry'];
const points = [10, 50, 10, 20, 20, 100];
let speed = 15; // in ms // time to travel 1px
const globalTurns = [
	{
		id: 1,
		direction: "right",
		axis: 'x',
		position: 10000
	}
];
const numberOfFruits = () => {
	let number = (Math.round(Math.random() * 10) % 5) + 1;
	const fruitsElement = document.querySelectorAll(".fruits .fruit");
	const currentNumOfFruits = fruitsElement.length;
	
	number = number - currentNumOfFruits;
	console.log(number, currentNumOfFruits);
	while (number > 0) {
		const random = Math.random();
		let fruitName;
		if (random <= 0.6) {
			const random2 = (Math.floor(Math.random() * 10) % 3);
			fruitName = fruits[random2];
			createFruit(fruitName);
			
		}
		else if (random <= 0.9) {
			const random2 = (Math.floor(Math.random() * 10) % 2) + 3;
			fruitName = fruits[random2];
			createFruit(fruitName);
		}
		else {
			//const random2 = (Math.floor(Math.random() * 10) % 2) + 3;
			fruitName = fruits[fruits.length - 1];
			createFruit(fruitName);
		}
		console.log("fruit: ", fruitName);
		
		number--;
	}
}

const createFruit = (fruitName) => {
	const newFruit = document.createElement("div");
	const newFruitImage = document.createElement("img");

	newFruit.classList.add("fruit");
	newFruitImage.src = `./img/${fruitName}.png`;

	const gameBody = document.querySelector(".game-body");
	const xLimit = +(gameBody.style.width.split('p')[0]) - 40;
	const yLimit = +(gameBody.style.height.split('p')[0]) - 40;

	let xp = Math.random() * xLimit;
	let yp = Math.random() * yLimit;

	newFruit.style.top = `${yp}px`;
	newFruit.style.left = `${xp}px`;

	newFruit.appendChild(newFruitImage);
	document.querySelector(".fruits").appendChild(newFruit);
}

const determineGrid = () => {
	let screenWidth = window.innerWidth;
	let screenHeight = Math.round(window.innerHeight - (window.innerHeight / 10));

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

const moveHead = () => {
	const gameBody = document.querySelector(".game-body");
	const snake = document.querySelector(".snake");
	const head = snake.querySelector(".head");

	const turns = globalTurns;

	let xp = +(head.style.left.split('p')[0]);
	let yp = +(head.style.top.split('p')[0]);
	let direction = '+x';

	setInterval(() => {

		if (direction === '+y') {
			yp = yp - 1;
			head.style.top = yp + 'px';
		}
		if (direction === '+x') {
			xp = xp + 1;
			head.style.left = xp + 'px';
		}
		if (direction === '-y') {
			yp = yp + 1;
			head.style.top = yp + 'px';
		}
		if (direction === '-x') {
			xp = xp - 1;
			head.style.left = xp + 'px';
		}
		
	}, speed);

	window.addEventListener("keyup", (e) => {
			
		if (e.code === 'ArrowDown') {
			direction = "-y";
			const currentTurn = globalTurns[globalTurns.length - 1];
			if (currentTurn.axis == 'x') {
				globalTurns[globalTurns.length - 1].position = xp;
			}
			else {
				globalTurns[globalTurns.length - 1].position = yp;
			}
			globalTurns.push({
				axis: 'y',
				position: 100000
			});
			console.log(globalTurns);
		}
		if (e.code === 'ArrowUp') {
			direction = "+y";
			const currentTurn = globalTurns[globalTurns.length - 1];
			if (currentTurn.axis == 'x') {
				globalTurns[globalTurns.length - 1].position = xp;
			}
			else {
				globalTurns[globalTurns.length - 1].position = yp;
			}
			globalTurns.push({
				axis: 'y',
				position: -100000
			});
		}
		if (e.code === 'ArrowLeft') {
			direction = "-x";
			const currentTurn = globalTurns[globalTurns.length - 1];
			if (currentTurn.axis == 'x') {
				globalTurns[globalTurns.length - 1].position = xp;
			}
			else {
				globalTurns[globalTurns.length - 1].position = yp;
			}
			globalTurns.push({
				axis: 'x',
				position: -100000
			});
		}
		if (e.code === 'ArrowRight') {
			direction = "+x";
			const currentTurn = globalTurns[globalTurns.length - 1];
			if (currentTurn.axis == 'x') {
				globalTurns[globalTurns.length - 1].position = xp;
			}
			else {
				globalTurns[globalTurns.length - 1].position = yp;
			}
			globalTurns.push({
				axis: 'x',
				position: 100000
			});
		}
		console.log(e.code);
	});

	// const moveUnit = (unit, next) => {
		
		
	// 	console.log('unit', unit);
	
	// 	let xp = +(unit.style.left.split('p')[0]);
	// 	let yp = +(unit.style.top.split('p')[0]);
	
	// 	turns.forEachWithCallback((turn, i, next2) => {
			
	// 		if (turn.axis === 'x') {
	// 			const interval = setInterval(() => {
	// 				//console.log("moving...");
						
	// 				xp = xp + ((turn.position - xp) / Math.abs(turn.position - xp));
	// 				//console.log("moving...", xp);
	// 				unit.style.left = xp + 'px';
					
	// 				if (xp == turn.position) {
	// 					clearInterval(interval);
	// 					next2();
	// 				}
					
					
	// 			}, speed);
	// 		}
			
	// 		if (turn.axis === 'y') {
	// 			const interval = setInterval(() => {
	// 				//console.log("moving...");
						
	// 				yp = yp + ((turn.position - yp) / Math.abs(turn.position - yp));
	// 				//console.log("moving...", yp);
	// 				unit.style.top = yp + 'px';
	// 				//turn = createTurn(turns, turn, xp, yp);
	// 				if (yp == turn.position) {
	// 					clearInterval(interval);
	// 					next2();
	// 				}
				
	// 			}, speed);
	// 		}
	// 	});	

	// 	next();
	// }

	// const units = snake.querySelectorAll(".unit");
	// 	// positioningUnit();
	// Array.from(units).forEachWithCallback((unit, i, next) => {
	// 	console.log(unit);
	// 	moveUnit(unit, next);
		
	// });
}
const moveUnit = () => {
	const snake = document.getElementById("snake");
	let units = snake.querySelectorAll(".unit");

	let unitTurnCount = [];


	const increaseUnit = () => {
		window.addEventListener("keyup", (e) => {
			if (e.code == 'Enter') {

				const turns = [...globalTurns];
				const extraUnit = document.createElement("div");
				extraUnit.classList.add("unit");

				const currentLastTurn = turns[unitTurnCount[unitTurnCount.length - 1]];
				//const nextTurn = turns[unitTurnCount[unitTurnCount.length - 1] + 1];
				const xp = +(units[units.length - 1].style.left.split('p')[0]);
				const yp = +(units[units.length - 1].style.top.split('p')[0]);

				if (currentLastTurn.axis == 'x') {
					if (currentLastTurn.position - xp > 0) {
						extraUnit.style.left = `${xp - 10}px`;
						extraUnit.style.top = `${yp}px`; 
					}
					else if (currentLastTurn.position - xp < 0) {
						extraUnit.style.left = `${xp + 10}px`;
						extraUnit.style.top = `${yp}px`;
					}
					else {
						setTimeout(() => {
							extraUnit.style.left = `${xp}px`;
							extraUnit.style.top = `${yp}px`;
						}, speed)
					}
					
				}
				else if (currentLastTurn.axis == 'y') {
					if (currentLastTurn.position - yp > 0) {
						extraUnit.style.left = `${xp}px`;
						extraUnit.style.top = `${yp - 10}px`; 
					}
					else if (currentLastTurn.position - xp < 0) {
						extraUnit.style.left = `${xp}px`;
						extraUnit.style.top = `${yp + 10}px`;
					}
					else {
						setTimeout(() => {
							extraUnit.style.left = `${xp}px`;
							extraUnit.style.top = `${yp}px`;
						}, speed)
					}
					
				}
				
				
				// extraUnit.style.left = `${xp + 10}px`;
				// extraUnit.style.top = `${yp}px`; 
				
	
				snake.appendChild(extraUnit);
				//
				// Array.from(units).push(extraUnit);
				// units[units.length] == extraUnit;
				units = snake.querySelectorAll(".unit");
				unitTurnCount.push(unitTurnCount[unitTurnCount.length - 1]);

			}
		})
	}


	increaseUnit();

	units.forEach(unit => {
		unitTurnCount.push(0);
	});

	setInterval(() => {
		const turns = [...globalTurns];
		
		let unitNumber = 0;
		units.forEach(unit => {
			const turn = turns[unitTurnCount[unitNumber]];

			let xp = +(unit.style.left.split('p')[0]);
			let yp = +(unit.style.top.split('p')[0]);

			if (turn.axis === 'x') {
				xp = xp + ((turn.position - xp) / Math.abs(turn.position - xp));
				unit.style.left = xp + 'px';

				if (turn.position == xp) {
					unitTurnCount[unitNumber]++;
				}
			}
						
			if (turn.axis === 'y') {
				yp = yp + ((turn.position - yp) / Math.abs(turn.position - yp));
				unit.style.top = yp + 'px';

				if (turn.position == yp) {
					unitTurnCount[unitNumber]++;
				}
			}

			unitNumber++;

		});
		
	}, speed);

	

	
}
const speedIncrementor = () => {
	setInterval(() => {
		speed -= 2;
		console.log("speed: ", speed);
	}, 10*1000)
}
const unitAutoPosition = () => {
	
}