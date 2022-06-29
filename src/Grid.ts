import Cell, { CellState } from "./Cell";
export enum GameResult {
    WIN = "You Won",
    LOSE = "You Lost",
}
class Grid {
    element: HTMLElement;
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
        this.columns = dimensions?.columns ?? 9;
        this.rows = dimensions?.rows ?? 9;
        this.hiddenCount = this.columns * this.rows;
        this.bombCount = Math.round(Math.sqrt(this.columns * this.rows));
        this.isOver = false;
        this.flaggedCount = 0;
        this.grid = [];
        this.setup();
        this.drawGrid();
    }
    setColumns(cols: number) {
        this.columns = cols;
        this.setup();
    }
    setRows(rows: number) {
        this.rows = rows;
        this.setup();
    }
    setup() {
        this.element.style.display = "grid";
        this.element.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        this.element.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
        // fill grid with cells
        this.grid = [];
        for (let i = 0; i < this.rows; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.columns; j++) {
                this.grid[i].push(new Cell({ x: j, y: i }));
            }
        }
        this.makeBombs();
    }
    gameOver(result: GameResult) {
        this.isOver = true;
        this.grid.flat().forEach((x) => {
            x.reveal();
        });
        alert(result);
    }
    checkWin() {
        console.log(`bombs: ${this.bombCount}  flags: ${this.flaggedCount}`);
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
    makeBombs() {
        for (let i = 0; i < this.bombCount; i++) {
            const x = Math.floor(Math.random() * this.columns);
            const y = Math.floor(Math.random() * this.rows);
            this.grid[y][x].isBomb = true;
        }
        this.hiddenCount -= this.bombCount;
    }
    drawGrid() {
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
