import { Coords2d, getDirectionsCanGoFromStartPosition, getNextPosition } from ".";
import { getFileLinesAsArr } from "../utils/getFileLinesAsArr";

const absoluteFilePathSamplePuzzleInput = `${__dirname}/../../src/10/samplePuzzleInput.txt`;

let puzzleInputAs2dArr: string[][];

beforeAll(async () => {
    const puzzleInputAsStringArrLineByLine: string[] = await getFileLinesAsArr(absoluteFilePathSamplePuzzleInput);
    puzzleInputAs2dArr = puzzleInputAsStringArrLineByLine.map((row: string) => {
        return row.split("").map((pipeSymbol: string) => pipeSymbol);
    });
});

describe("getDirectionsCanGoFromStartPosition", () => {
    test("starting 2d coordinates can go to from starting position 's' are {x: 2, y: 1} and {x: 1, y: 2} on sample puzzle input", () => {
        const actualCoordsCanGoToArr = getDirectionsCanGoFromStartPosition(1, 1, puzzleInputAs2dArr);
        const expectedCoordsCanGoToArr: Coords2d[] = [
            { x: 2, y: 1 },
            { x: 1, y: 2 }
        ];

        expect(actualCoordsCanGoToArr).toEqual(expectedCoordsCanGoToArr);
    });
});

describe("getNextPositions", () => {
    test("given the sample puzzle input, when on tile {x: 2, y: 1} ('-') the next position to go to is [{x: 3, y: 1}] ('7') ", () => {
        const actualCoordsCanGoToArr = getNextPosition(2, 1, puzzleInputAs2dArr, { x: 1, y: 1 });
        const expectedCoordsCanGoToArr: Coords2d[] = [{ x: 3, y: 1 }];

        expect(actualCoordsCanGoToArr).toEqual(expectedCoordsCanGoToArr);
        expect(puzzleInputAs2dArr[actualCoordsCanGoToArr.y][actualCoordsCanGoToArr.x]).toEqual("7");
    });

    test("given the sample puzzle input, when on tile {x: 3, y: 1} ('7') and the known previous tile was at {x: 2, y: 1} the next position to go to is [{x: 3, y: 2}] ('|') ", () => {
        const actualCoordsCanGoToArr = getNextPosition(3, 1, puzzleInputAs2dArr, { x: 2, y: 1 });
        const expectedCoordsCanGoToArr: Coords2d[] = [{ x: 3, y: 2 }];

        expect(actualCoordsCanGoToArr).toEqual(expectedCoordsCanGoToArr);
        expect(puzzleInputAs2dArr[actualCoordsCanGoToArr.y][actualCoordsCanGoToArr.x]).toEqual("|");
    });

    test("given the sample puzzle input, when on tile { x: 3, y: 2 } ('|') and the known previous tile was at {x: 3, y: 1} ('7') the next position to go to is [{x: 3, y: 3}] ('J') ", () => {
        const actualCoordsCanGoToArr = getNextPosition(3, 2, puzzleInputAs2dArr, { x: 3, y: 1 });
        const expectedCoordsCanGoToArr: Coords2d[] = [{ x: 3, y: 3 }];

        expect(actualCoordsCanGoToArr).toEqual(expectedCoordsCanGoToArr);
        expect(puzzleInputAs2dArr[actualCoordsCanGoToArr.y][actualCoordsCanGoToArr.x]).toEqual("J");
    });

    test("given the sample puzzle input, when on tile { x: 3, y: 3} ('J') and the known previous tile was at {x: 3, y: 2} ('|') the next position to go to is [{x: 2, y: 3}] ('-') ", () => {
        const actualCoordsCanGoToArr = getNextPosition(3, 3, puzzleInputAs2dArr, { x: 3, y: 2 });
        const expectedCoordsCanGoToArr: Coords2d[] = [{ x: 2, y: 3 }];

        expect(actualCoordsCanGoToArr).toEqual(expectedCoordsCanGoToArr);
        expect(puzzleInputAs2dArr[actualCoordsCanGoToArr.y][actualCoordsCanGoToArr.x]).toEqual("-");
    });

    test("given the sample puzzle input, when on tile { x: 1, y: 1 } ('|') and the known previous tile was at {x: 1, y: 3} ('L') the next position to go to is [{x: 1, y: 1}] ('S') ", () => {
        const actualCoordsCanGoToArr = getNextPosition(1, 2, puzzleInputAs2dArr, { x: 1, y: 3 });
        const expectedCoordsCanGoToArr: Coords2d[] = [{ x: 1, y: 1 }];

        expect(actualCoordsCanGoToArr).toEqual(expectedCoordsCanGoToArr);
        expect(puzzleInputAs2dArr[actualCoordsCanGoToArr.y][actualCoordsCanGoToArr.x]).toEqual("S");
    });
});
