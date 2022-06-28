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
        return neighbours;
    }

    #setupListeners() {
        this.element.addEventListener("click", (_e) => {
            this.reveal();
            this.neighbours.forEach((cell) => {
                cell.reveal();
            });
        });
    }
    reveal() {
        if (this.state == CellState.REVEALED) return;
        this.state = CellState.REVEALED;
        this.element.textContent = this.isBomb ? "b" : "c";
        // this.neighbours.forEach((cell) => {
        //     cell.reveal();
        // });
    }
}
export default Cell;
