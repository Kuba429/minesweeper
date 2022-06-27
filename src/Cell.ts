export enum CellState {
    "HIDDEN",
    "REVEALED",
}
class Cell {
    x: number;
    y: number;
    state: CellState;
    element: HTMLElement;
    constructor(position: { x: number; y: number }) {
        this.x = position.x;
        this.y = position.y;
        this.state = CellState.HIDDEN;
        this.element = document.createElement("button");
        this.element.classList.add("cell");
    }
}
export default Cell;
