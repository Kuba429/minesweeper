import Cell, { CellState } from "./Cell";
export enum GameResult {
	WIN = "You Won",
	LOSE = "You Lost",
}
class Grid {
	element: HTMLElement;
	resultElement: HTMLElement;
	settingsElement: HTMLFormElement;
	columns: number;
	bombCount: number;
	flaggedCount: number;
	hiddenCount: number;
	isOver: boolean;
	rows: number;
	grid: Array<Array<Cell>>;
	constructor(
		element: HTMLElement,
		dimensions?: { columns?: number; rows?: number }
	) {
		this.element = element;
		this.resultElement = document.querySelector(".result")!;
		this.settingsElement = document.querySelector("#settings")!;
		this.columns = dimensions?.columns ?? 9;
		this.rows = dimensions?.rows ?? 9;
		this.hiddenCount = this.columns * this.rows;
		this.bombCount = Math.round(Math.sqrt(this.columns * this.rows));
		this.isOver = true;
		this.flaggedCount = 0;
		this.grid = [];
		this.setup();
		this.settingsElement.addEventListener("input", (e) => this.setup(e));
		this.settingsElement.addEventListener("submit", (e) => this.setup(e)); // must invoke with lambda, otherwise setup method can't access 'this'
	}
	setColumns(cols: number) {
		this.columns = cols;
		this.start();
	}
	setRows(rows: number) {
		this.rows = rows;
		this.start();
	}
	setup(e?: Event) {
		e?.preventDefault();
		// reset everything
		this.isOver = true;
		// apply settings
		const settings = new FormData(this.settingsElement);
		this.columns = settings.get("columns")! as unknown as number;
		this.rows = settings.get("rows")! as unknown as number;

		const bombPercentage =
			(settings.get("bombs")! as unknown as number) * 0.01;
		this.bombCount = Math.round(this.columns * this.rows * bombPercentage);
		this.hiddenCount = this.columns * this.rows;
		this.flaggedCount = 0;
		this.element.style.display = "grid";
		this.element.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
		this.element.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
		this.makeGrid();
	}
	start(ignore?: { x: number; y: number }) {
		// ignore prop to make sure the first cell clicked isn't a bomb
		this.isOver = false;
		this.resultElement.classList.remove("game-over");
		this.makeBombs(ignore);
	}
	gameOver(result: GameResult) {
		this.isOver = true;
		this.grid.flat().forEach((x) => {
			x.reveal();
		});
		this.resultElement.textContent = result;
		this.resultElement.classList.add("game-over");
	}
	checkWin() {
		if (this.hiddenCount === 0) this.gameOver(GameResult.WIN); // win if there are no hidden elements left
		if (this.flaggedCount !== this.bombCount) return; // possible win if every bomb is flagged
		let bombsLeft = this.bombCount;
		this.grid.flat().forEach((cell) => {
			if (cell.state == CellState.FLAG) {
				if (cell.isBomb) bombsLeft--;
				else bombsLeft++;
			}
		});
		bombsLeft === 0 && this.gameOver(GameResult.WIN);
	}
	makeBombs(ignore?: { x: number; y: number }) {
		for (let i = 0; i < this.bombCount; i++) {
			const x = Math.floor(Math.random() * this.columns);
			const y = Math.floor(Math.random() * this.rows);
			if (ignore && ignore?.x == x && ignore?.y == y) {
				// skip this iteration if x and y are x and y of the cell that's been clicked first
				i -= 1;
				continue;
			}
			this.grid[y][x].isBomb = true;
		}
		this.hiddenCount -= this.bombCount;
	}
	makeGrid() {
		this.grid = [];
		for (let i = 0; i < this.rows; i++) {
			this.grid.push([]);
			for (let j = 0; j < this.columns; j++) {
				this.grid[i].push(new Cell({ x: j, y: i }, this));
			}
		}
		const fragment = document.createDocumentFragment();
		this.grid.forEach((row) => {
			row.forEach((cell) => {
				fragment.appendChild(cell.element);
			});
		});
		this.element.innerHTML = "";
		this.element.appendChild(fragment);
	}
}
export default Grid;
