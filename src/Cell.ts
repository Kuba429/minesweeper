import { GameResult } from "./Grid";
import { grid } from "./main";

export enum CellState {
    "HIDDEN",
    "REVEALED",
    "FLAG",
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
        let willToggleFlag = false; // will flag be toggled after "pointerup"?; true -> toggle flag; false -> reveal(regular click);
        let timeout: number;
        this.element.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            timeout = setTimeout(() => {
                willToggleFlag = true;
                this.state !== CellState.REVEALED &&
                    this.element.classList.toggle("flag"); // only toggle dom class, not the actual state, to indicate that the state will change when user stops holding (makes it look like it has already changed); if it were to toggle the state it could cause bugs eg cell would be revealed every time user tries to "unflag" a cell
            }, 500); // how long does the user have to hold to flag
        });
        this.element.addEventListener("pointerup", (e) => {
            e.preventDefault();
            clearTimeout(timeout);
            if (willToggleFlag) this.toggleFlag();
            else this.click();
            willToggleFlag = false;
        });
        this.element.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            willToggleFlag = true;
            this.state !== CellState.REVEALED &&
                this.element.classList.toggle("flag");
        });
    }
    toggleFlag() {
        switch (this.state) {
            case CellState.REVEALED:
                return;
            case CellState.FLAG:
                this.state = CellState.HIDDEN;
                grid.flaggedCount--;
                this.element.classList.remove("flag"); // not toggle because appropriate class will likely already be there (see #setupListeners, "pointerdown" event handler)
                break;
            case CellState.HIDDEN:
                this.state = CellState.FLAG;
                this.element.classList.add("flag");
                grid.flaggedCount++;
                break;
        }
        grid.checkWin();
    }
    click() {
        // what you think would happen when you click a cell
        if (this.isBomb) grid.gameOver(GameResult.LOSE);
        else this.reveal();
    }
    reveal() {
        if (this.state == CellState.REVEALED) return;
        grid.hiddenCount--;
        this.state = CellState.REVEALED;
        this.element.classList.add("revealed");
        this.isBomb && this.element.classList.add("bomb");
        if (this.howManyBombs > 0) {
            this.element.textContent = this.howManyBombs.toString();
        } else {
            this.neighbours.forEach((cell) => {
                cell.reveal();
            });
        }
        if (!grid.isOver) grid.checkWin();
    }
}
export default Cell;
