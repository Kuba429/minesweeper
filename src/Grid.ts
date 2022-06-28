import Cell from "./Cell";

class Grid {
    element: HTMLElement;
    columns: number;
    bombCount: number;
    rows: number;
    grid: Array<Array<Cell>>;
    constructor(
        element: HTMLElement,
        dimensions?: { columns?: number; rows?: number }
    ) {
        this.element = element;
        this.columns = dimensions?.columns ?? 9;
        this.rows = dimensions?.rows ?? 9;
        this.bombCount = 2;
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
