function forEachWithCallback(callback) {
	const arrayCopy = this;
	let index = 0;
	const next = () => {
		index++;
		if (arrayCopy.length > 0) {
			callback(arrayCopy.shift(), index, next);
		}
	};
	next();
}
Array.prototype.forEachWithCallback = forEachWithCallback;

function Timer(fn, t) {
	// <<- Custom setInterval function which allows reset of the interval
	var timerObj = setInterval(fn, t);

	this.stop = function () {
		if (timerObj) {
			clearInterval(timerObj);
			timerObj = null;
		}
		return this;
	};

	// start timer using current settings (if it's not already running)
	this.start = function () {
		if (!timerObj) {
			this.stop();
			timerObj = setInterval(fn, t);
		}
		return this;
	};

	// start with new or original interval, stop current interval
	this.reset = function (newT = t) {
		t = newT;
		return this.stop().start();
	};
}
window.addEventListener("load", () => {
	determineGrid();
	speedIncrementor();
	numberOfFruits();
	moveHead();
	moveUnit();
	window.addEventListener("resize", () => {
		determineGrid();
	});
	stopAllMovement();
	clearTurns();
});

// GLOBAL VARIABLES ->
const fruits = [
	"green_apple",
	"mango",
	"banana",
	"cherry",
	"apple",
	"strawberry",
];
const points = [10, 10, 10, 20, 20, 50];
let speed = 16; // in ms // time to travel 1px
const accTime = 10 * 1000; // in ms // time after which speed will increase
const acc = 0.5; // in ms // time by which speed will increase
let moveUnitByInterval,
	moveHeadByInterval,
	checkFruitEatenInterval,
	speedIncrementorInterval;
let moveHeadEvent;
let gameBodyLimits = {
	width: Number,
	height: Number,
};
let score = 0;
let unitTurnCount = [];

const globalTurns = [
	{
		id: 1,
		direction: "right",
		axis: "x",
		position: 10000,
	},
];

// FUNCTIONS ->
const numberOfFruits = () => {
	let number = (Math.round(Math.random() * 10) % 5) + 1;
	const fruitsElement = document.querySelectorAll(".fruits .fruit");
	const currentNumOfFruits = fruitsElement.length;

	number = number - currentNumOfFruits;

	number = number == 0 && currentNumOfFruits == 1 ? 1 : number;
	console.log(number, currentNumOfFruits);

	while (number > 0) {
		const random = Math.random();
		let fruitName;

		if (random <= 0.6) {
			const random2 = Math.floor(Math.random() * 10) % 3;
			fruitName = fruits[random2];
			createFruit(fruitName);
		} else if (random <= 0.9) {
			const random2 = (Math.floor(Math.random() * 10) % 2) + 3;
			fruitName = fruits[random2];
			createFruit(fruitName);
		} else {
			//const random2 = (Math.floor(Math.random() * 10) % 2) + 3;
			fruitName = fruits[fruits.length - 1];
			createFruit(fruitName);
		}
		console.log("fruit: ", fruitName);

		number--;
	}
};
const createFruit = (fruitName) => {
	const newFruit = document.createElement("div");
	const newFruitImage = document.createElement("img");

	newFruit.classList.add("fruit");
	newFruit.setAttribute("id", fruitName);
	newFruitImage.src = `./img/${fruitName}.png`;

	const gameBody = document.querySelector(".game-body");
	const xLimit = +gameBody.style.width.split("p")[0] - 40;
	const yLimit = +gameBody.style.height.split("p")[0] - 40;

	let xp = Math.random() * xLimit;
	let yp = Math.random() * yLimit;

	newFruit.style.top = `${yp}px`;
	newFruit.style.left = `${xp}px`;

	newFruit.appendChild(newFruitImage);
	document.querySelector(".fruits").appendChild(newFruit);
};
const determineGrid = () => {
	let screenWidth = window.innerWidth;
	let screenHeight = Math.round(window.innerHeight - window.innerHeight / 10);

	let columns, rows;

	for (let i = 0; i < 40; i++) {
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
	gameBodyLimits.width = rows * 40;
	gameBodyLimits.height = columns * 40;

	// gameBody.style.margin = 'auto';
};
const moveHead = () => {
	const gameBody = document.querySelector(".game-body");
	const snake = document.querySelector(".snake");
	const head = snake.querySelector(".head");

	const turns = globalTurns;

	let xp = +head.style.left.split("p")[0];
	let yp = +head.style.top.split("p")[0];
	let direction = "+x";

	moveHeadByInterval = new Timer(() => {
		if (direction === "+y") {
			yp = yp - 1;
			head.style.top = yp + "px";
		}
		if (direction === "+x") {
			xp = xp + 1;
			head.style.left = xp + "px";
		}
		if (direction === "-y") {
			yp = yp + 1;
			head.style.top = yp + "px";
		}
		if (direction === "-x") {
			xp = xp - 1;
			head.style.left = xp + "px";
		}
	}, speed);

	setInterval(() => {
		moveHeadByInterval.reset(speed);
	}, accTime);

	moveHeadEvent = window.addEventListener("keyup", (e) => {
		if (e.code === "ArrowDown" && direction != "+y") {
			direction = "-y";
			const currentTurn = globalTurns[globalTurns.length - 1];
			if (currentTurn.axis == "x") {
				globalTurns[globalTurns.length - 1].position = xp;
			} else {
				globalTurns[globalTurns.length - 1].position = yp;
			}
			globalTurns.push({
				axis: "y",
				position: 100000,
			});

			//console.log(globalTurns);
		}
		if (e.code === "ArrowUp" && direction != "-y") {
			direction = "+y";
			const currentTurn = globalTurns[globalTurns.length - 1];
			if (currentTurn.axis == "x") {
				globalTurns[globalTurns.length - 1].position = xp;
			} else {
				globalTurns[globalTurns.length - 1].position = yp;
			}
			globalTurns.push({
				axis: "y",
				position: -100000,
			});
		}
		if (e.code === "ArrowLeft" && direction != "+x") {
			direction = "-x";
			const currentTurn = globalTurns[globalTurns.length - 1];
			if (currentTurn.axis == "x") {
				globalTurns[globalTurns.length - 1].position = xp;
			} else {
				globalTurns[globalTurns.length - 1].position = yp;
			}
			globalTurns.push({
				axis: "x",
				position: -100000,
			});
		}
		if (e.code === "ArrowRight" && direction != "-x") {
			direction = "+x";
			const currentTurn = globalTurns[globalTurns.length - 1];
			if (currentTurn.axis == "x") {
				globalTurns[globalTurns.length - 1].position = xp;
			} else {
				globalTurns[globalTurns.length - 1].position = yp;
			}
			globalTurns.push({
				axis: "x",
				position: 100000,
			});
		}
		console.log(e.code);
	});

	const detectSwap = () => {
		let touchstartX = 0;
		let touchstartY = 0;
		let touchendX = 0;
		let touchendY = 0;

		const gestureZone = document.querySelector(".game-body");

		gestureZone.addEventListener(
			"touchstart",
			function (event) {
				touchstartX = event.changedTouches[0].screenX;
				touchstartY = event.changedTouches[0].screenY;
			},
			false
		);

		gestureZone.addEventListener(
			"touchend",
			function (event) {
				touchendX = event.changedTouches[0].screenX;
				touchendY = event.changedTouches[0].screenY;
				handleGesture();
			},
			false
		);

		function handleGesture() {
			if (50 <= touchstartX - touchendX && direction != "+x") {
				console.log("Swiped left");
				direction = "-x";
				const currentTurn = globalTurns[globalTurns.length - 1];
				if (currentTurn.axis == "x") {
					globalTurns[globalTurns.length - 1].position = xp;
				} else {
					globalTurns[globalTurns.length - 1].position = yp;
				}
				globalTurns.push({
					axis: "x",
					position: -100000,
				});
			}

			if (touchendX - touchstartX >= 50 && direction != "-x") {
				console.log("Swiped right");
				direction = "+x";
				const currentTurn = globalTurns[globalTurns.length - 1];
				if (currentTurn.axis == "x") {
					globalTurns[globalTurns.length - 1].position = xp;
				} else {
					globalTurns[globalTurns.length - 1].position = yp;
				}
				globalTurns.push({
					axis: "x",
					position: 100000,
				});
			}

			if (50 <= touchstartY - touchendY && direction != "-y") {
				console.log("Swiped up");
				direction = "+y";
				const currentTurn = globalTurns[globalTurns.length - 1];
				if (currentTurn.axis == "x") {
					globalTurns[globalTurns.length - 1].position = xp;
				} else {
					globalTurns[globalTurns.length - 1].position = yp;
				}
				globalTurns.push({
					axis: "y",
					position: -100000,
				});
			}

			if (touchendY - touchstartY >= 50 && direction != "+y") {
				console.log("Swiped down");
				direction = "-y";
				const currentTurn = globalTurns[globalTurns.length - 1];
				if (currentTurn.axis == "x") {
					globalTurns[globalTurns.length - 1].position = xp;
				} else {
					globalTurns[globalTurns.length - 1].position = yp;
				}
				globalTurns.push({
					axis: "y",
					position: 100000,
				});
			}

			if (touchendY === touchstartY) {
				console.log("Tap");
			}
		}
	};

	detectSwap();
};
const moveUnit = () => {
	const snake = document.getElementById("snake");
	let units = snake.querySelectorAll(".unit");

	const increaseUnit = () => {
		const turns = [...globalTurns];
		const extraUnit = document.createElement("div");
		extraUnit.classList.add("unit");

		const currentLastTurn = turns[unitTurnCount[unitTurnCount.length - 1]];
		//const nextTurn = turns[unitTurnCount[unitTurnCount.length - 1] + 1];
		const xp = +units[units.length - 1].style.left.split("p")[0];
		const yp = +units[units.length - 1].style.top.split("p")[0];

		if (currentLastTurn.axis == "x") {
			if (currentLastTurn.position - xp > 0) {
				extraUnit.style.left = `${xp - 10}px`;
				extraUnit.style.top = `${yp}px`;
			} else if (currentLastTurn.position - xp < 0) {
				extraUnit.style.left = `${xp + 10}px`;
				extraUnit.style.top = `${yp}px`;
			} else {
				setTimeout(() => {
					extraUnit.style.left = `${xp}px`;
					extraUnit.style.top = `${yp}px`;
				}, speed);
			}
		} else if (currentLastTurn.axis == "y") {
			if (currentLastTurn.position - yp > 0) {
				extraUnit.style.left = `${xp}px`;
				extraUnit.style.top = `${yp - 10}px`;
			} else if (currentLastTurn.position - xp < 0) {
				extraUnit.style.left = `${xp}px`;
				extraUnit.style.top = `${yp + 10}px`;
			} else {
				setTimeout(() => {
					extraUnit.style.left = `${xp}px`;
					extraUnit.style.top = `${yp}px`;
				}, speed);
			}
		}

		extraUnit.style.width = `10px`;
		extraUnit.style.height = `10px`;

		snake.appendChild(extraUnit);
		//
		// Array.from(units).push(extraUnit);
		// units[units.length] == extraUnit;
		units = snake.querySelectorAll(".unit");
		unitTurnCount.push(unitTurnCount[unitTurnCount.length - 1]);
	};
	checkFruitEaten(increaseUnit);

	units.forEach((unit) => {
		unitTurnCount.push(0);
	});

	moveUnitByInterval = new Timer(() => {
		const turns = [...globalTurns];

		let unitNumber = 0;
		units.forEach((unit) => {
			const turn = turns[unitTurnCount[unitNumber]];

			let xp = +unit.style.left.split("p")[0];
			let yp = +unit.style.top.split("p")[0];

			if (turn.axis === "x") {
				xp = xp + (turn.position - xp) / Math.abs(turn.position - xp);
				unit.style.left = xp + "px";

				if (turn.position == xp) {
					unitTurnCount[unitNumber]++;
					//clearTurns();
				}
			}

			if (turn.axis === "y") {
				yp = yp + (turn.position - yp) / Math.abs(turn.position - yp);
				unit.style.top = yp + "px";

				if (turn.position == yp) {
					unitTurnCount[unitNumber]++;
					//clearTurns();
				}
			}

			unitNumber++;
		});
	}, speed);

	setInterval(() => {
		moveUnitByInterval.reset(speed);
	}, accTime);
};
const speedIncrementor = () => {
	speedIncrementorInterval = new Timer(() => {
		speed -= acc;
		console.log("speed: ", speed);

		if (speed <= 5) {
			clearInterval(interval);
		}
	}, accTime);
};
const checkFruitEaten = (increaseUnit) => {
	checkFruitEatenInterval = new Timer(() => {
		const fruitElements = document.querySelectorAll(".fruit");
		const snakeHead = document.querySelector(".head");

		for (let i = 0; i < fruitElements.length; i++) {
			const isColliding = is_colliding(snakeHead, fruitElements[i]);

			if (isColliding) {
				console.log(isColliding);
				scoreIncrementor(fruitElements[i].getAttribute("id"));
				fruitElements[i].parentElement.removeChild(fruitElements[i]);
				numberOfFruits();

				increaseUnit();
			}
		}
	}, speed);

	setInterval(() => {
		checkFruitEatenInterval.reset(speed);
	}, accTime);
};
const is_colliding = (div1, div2) => {
	const d1_top = +div1.style.top.split("p")[0];
	const d1_bottom =
		+div1.style.top.split("p")[0] + +div1.style.height.split("p")[0];
	const d1_left = +div1.style.left.split("p")[0];
	const d1_right =
		+div1.style.left.split("p")[0] + +div1.style.width.split("p")[0];

	const d2_top = +div2.style.top.split("p")[0] + 30;
	const d2_bottom = +div2.style.top.split("p")[0] + 40 + 30;
	const d2_left = +div2.style.left.split("p")[0];
	const d2_right = +div2.style.left.split("p")[0] + 40;

	//console.log(d1_top, );

	let colliding = false;

	if (
		d1_top > d2_top &&
		d1_top < d2_bottom &&
		((d1_left > d2_left && d1_left < d2_right) ||
			(d1_right > d2_left && d1_right < d2_right))
	) {
		colliding = true;
		// console.log(d1_top, d2_top);
		// console.log(d1_left, d2_left);
		// console.log(d1_right, d2_right);
		// console.log(d1_bottom, d2_bottom);
	}
	if (
		d1_bottom > d2_top &&
		d1_bottom < d2_bottom &&
		((d1_left > d2_left && d1_left < d2_right) ||
			(d1_right > d2_left && d1_right < d2_right))
	) {
		colliding = true;
		console.log("true");
	}

	return colliding;
};
const snakeIsColliding = (div1, div2) => {
	const d1_top = +div1.style.top.split("p")[0];
	const d1_bottom =
		+div1.style.top.split("p")[0] + +div1.style.height.split("p")[0];
	const d1_left = +div1.style.left.split("p")[0];
	const d1_right =
		+div1.style.left.split("p")[0] + +div1.style.width.split("p")[0];

	const d2_top = +div2.style.top.split("p")[0];
	const d2_bottom = +div2.style.top.split("p")[0] + 10;
	const d2_left = +div2.style.left.split("p")[0];
	const d2_right = +div2.style.left.split("p")[0] + 10;

	//console.log(d1_top, );

	let colliding = false;

	if (
		d1_top > d2_top &&
		d1_top < d2_bottom &&
		((d1_left > d2_left && d1_left < d2_right) ||
			(d1_right > d2_left && d1_right < d2_right))
	) {
		colliding = true;
		// console.log(d1_top, d2_top);
		// console.log(d1_left, d2_left);
		// console.log(d1_right, d2_right);
		// console.log(d1_bottom, d2_bottom);
	}
	if (
		d1_bottom > d2_top &&
		d1_bottom < d2_bottom &&
		((d1_left > d2_left && d1_left < d2_right) ||
			(d1_right > d2_left && d1_right < d2_right))
	) {
		colliding = true;
		console.log("true");
	}

	return colliding;
};
const stopAllMovement = () => {
	const interval = new Timer(() => {
		const snakeHead = document.querySelector(".head");
		const units = document.querySelectorAll(".unit");

		for (let i = 1; i < units.length; i++) {
			const isColliding = snakeIsColliding(snakeHead, units[i]);

			if (isColliding) {
				console.log("collision: ", isColliding);
				moveHeadByInterval.stop();
				moveUnitByInterval.stop();
				speedIncrementorInterval.stop();
				checkFruitEatenInterval.stop();
				interval.stop();
			}
		}

		if (
			+snakeHead.style.left.split("p")[0] < 0 ||
			+snakeHead.style.top.split("p")[0] < 0 ||
			+snakeHead.style.left.split("p")[0] +
				+snakeHead.style.width.split("p")[0] >
				gameBodyLimits.width ||
			+snakeHead.style.top.split("p")[0] +
				+snakeHead.style.width.split("p")[0] >
				gameBodyLimits.height
		) {
			console.log("collision: ");
			moveHeadByInterval.stop();
			moveUnitByInterval.stop();
			speedIncrementorInterval.stop();
			checkFruitEatenInterval.stop();
			interval.stop();
		}
	}, speed);

	setInterval(() => {
		interval.reset(speed);
	}, accTime);
};
const scoreIncrementor = (fruitName) => {
	let i = fruits.indexOf(fruitName);
	score += points[i];
	const scoreElement = document.querySelector(".score .points");
	scoreElement.innerHTML = score;
};
const clearTurns = () => {
	let min = unitTurnCount[0];
	unitTurnCount.forEach((count) => {
		if (min > count) {
			min = count;
		}
	});
};
