import { JSDOM } from "jsdom";
import { CellState } from "../Cell";
import Grid from "../Grid";

const dom = await JSDOM.fromFile("index.html");
global.document = dom.window.document;

const grid = new Grid(document.querySelector("#grid")!);

beforeEach(() => {
	grid.settingsElement.reset();
	grid.settingsElement.dispatchEvent(new Event("submit"));
});

describe("Grid", () => {
	it("First cell can't be a bomb", () => {
		let didLose = false;
		for (let i = 0; i < 50; i++) {
			const randomRow = Math.round(Math.random() * (grid.rows - 1));
			const randomCol = Math.round(Math.random() * (grid.columns - 1));
			grid.grid[randomRow][randomCol].click();
			// check if the first move caused loss
			if (grid.isOver) {
				didLose = true;
				break;
			}
			// reset
			grid.settingsElement.dispatchEvent(new Event("submit"));
		}
		expect(didLose).toBe(false);
		grid.settingsElement.dispatchEvent(new Event("submit"));
	});
	it("Flag a cell on right click", () => {
		let isFailed = false;
		const cells = grid.grid.flat();
		const count = Math.min(Math.floor(cells.length / 4), 25);
		for (let i = 0; i < count; i++) {
			const randomIndex = Math.round(Math.random() * (cells.length - 1));
			cells[randomIndex].element.dispatchEvent(new Event("contextmenu"));
			cells[randomIndex].element.dispatchEvent(new Event("pointerup"));
			if (cells[randomIndex].state !== CellState.FLAG) {
				isFailed = true;
				break;
			}
			cells.splice(randomIndex, 1);
		}
		expect(isFailed!).toBe(false);
		expect(grid.flaggedCount).toBe(count);
	});
});

export {};
