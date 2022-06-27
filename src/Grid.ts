import Cell from "./Cell";

class Grid {
    element: HTMLElement;
    columns: number;
    rows: number;
    grid: Array<Array<Cell>>;
    constructor(
        element: HTMLElement,
        dimensions?: { columns?: number; rows?: number }
    ) {
        this.element = element;
        this.columns = dimensions?.columns ?? 9;
        this.rows = dimensions?.rows ?? 9;
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
        // fill grid with cells
        this.grid = [];
        this.element.style.display = "grid";
        this.element.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        this.element.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
        for (let i = 0; i < this.rows; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.columns; j++) {
                this.grid[i].push(new Cell({ x: i, y: j }));
            }
        }
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
