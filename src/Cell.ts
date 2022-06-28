import { grid } from "./main";

export enum CellState {
    "HIDDEN",
    "REVEALED",
}

class Cell {
    x: number;
    y: number;
    state: CellState;
    isBomb: boolean;
    element: HTMLElement;
    neighboursMemoized?: Array<Cell>;
    howManyBombsMemoized?: number;
    constructor(position: { x: number; y: number }) {
        this.x = position.x;
        this.y = position.y;
        this.isBomb = false;
        this.state = CellState.HIDDEN;
        this.element = document.createElement("button");
        this.element.classList.add("cell");
        // this.element.textContent = `${this.x},${this.y}`;
        this.#setupListeners();
    }
    get neighbours() {
        if (!this.neighboursMemoized) this.#getNeighbours(); // memoize neighbours
        return this.neighboursMemoized!; // function above ensures memoized neighbours are defined (empty array if they don't exist)
    }
    #getNeighbours() {
        const neighbours: Array<Cell> = [];
        if (this.y > 0) neighbours.push(grid.grid[this.y - 1][this.x]); // up
        if (this.y < grid.rows - 1)
            neighbours.push(grid.grid[this.y + 1][this.x]); // down
        if (this.x > 0) neighbours.push(grid.grid[this.y][this.x - 1]); // left
        if (this.x < grid.columns - 1)
            neighbours.push(grid.grid[this.y][this.x + 1]); // right
        if (this.y > 0 && this.x > 0)
            neighbours.push(grid.grid[this.y - 1][this.x - 1]); // up left
        if (this.y > 0 && this.x < grid.columns - 1)
            neighbours.push(grid.grid[this.y - 1][this.x + 1]); // up right

        if (this.y < grid.rows - 1 && this.x > 0)
            neighbours.push(grid.grid[this.y + 1][this.x - 1]); // down left

        if (this.y < grid.rows - 1 && this.x < grid.columns - 1)
            neighbours.push(grid.grid[this.y + 1][this.x + 1]); // down right
        this.neighboursMemoized = neighbours;
    }
    get howManyBombs() {
        if (!this.howManyBombsMemoized) this.#getHowManyBombs();
        return this.howManyBombsMemoized!;
    }
    #getHowManyBombs() {
        //how many bombs around this cell
        let count = 0;
        this.neighbours.forEach((cell) => {
            if (cell.isBomb) count++;
        });
        this.howManyBombsMemoized = count;
    }
    #setupListeners() {
        this.element.addEventListener("click", (_e) => {
            this.reveal();
        });
    }
    reveal() {
        if (this.state == CellState.REVEALED) return;

        this.state = CellState.REVEALED;
        // this.element.textContent = this.isBomb ? "b" : "";
        this.element.classList.add("revealed");
        this.isBomb && this.element.classList.add("bomb");

        if (this.howManyBombs > 0) {
            this.element.textContent = this.howManyBombs.toString();
        } else {
            this.neighbours.forEach((cell) => {
                cell.reveal();
            });
        }
    }
}
export default Cell;
