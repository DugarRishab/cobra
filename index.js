window.addEventListener("load", () => {
	determineGrid();
	window.addEventListener("resize", () => {
		determineGrid();
	});
});

const fruits = ['apple', 'mango', 'banana', 'cherry', 'pineapple', 'strawberry'];
const points = [10, 50, 10, 20, 20, 100];

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

	
}