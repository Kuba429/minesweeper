import { JSDOM } from "jsdom";
import Grid from "../Grid";

const dom = await JSDOM.fromFile("index.html");
global.document = dom.window.document;

const grid = new Grid(document.querySelector("#grid")!);
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
	});
});

export {};
