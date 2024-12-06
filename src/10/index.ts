// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
// S would be + pipe shape?

import { getFileLinesAsArr } from "../utils/getFileLinesAsArr";

export type PipeSymbol = "|" | "-" | "L" | "J" | "7" | "F";

const x = {
    "|": "ns",
    "-": "ew",
    L: "ne",
    J: "nw",
    "7": "sw",
    F: "se",
    ".": "ground",
    S: "start"
};

const validPositionsFromStart = {
    "1,0": ["-", "J", "7", "S"],
    "-1,0": ["-", "L", "F", "S"],
    "0,-1": ["|", "F", "7", "S"],
    "0,1": ["|", "J", "L", "S"]
};

export function getNextPositions(x: number, y: number, arr2d: string[][], previousPos: Coords2d): Coords2d[] {
    const pipeSymbolAtCurrentTile = arr2d[y][x] as PipeSymbol;
    const leftPipe = arr2d[y][x - 1];
    const rightPipe = arr2d[y][x + 1];
    const abovePipe = arr2d[y - 1][x];
    const belowPipe = arr2d[y + 1][x];

    const validNextPositions = [];

    if (pipeSymbolAtCurrentTile === "-") {
        if (validPositionsFromStart["-1,0"].includes(leftPipe)) {
            validNextPositions.push({ x: x - 1, y });
        }

        if (validPositionsFromStart["1,0"].includes(rightPipe)) {
            validNextPositions.push({ x: x + 1, y });
        }
    } else if (pipeSymbolAtCurrentTile === "|") {
        if (validPositionsFromStart["0,-1"].includes(abovePipe)) {
            validNextPositions.push({ x, y: y - 1 });
        }

        if (validPositionsFromStart["0,1"].includes(belowPipe)) {
            validNextPositions.push({ x, y: y + 1 });
        }
    } else if (pipeSymbolAtCurrentTile === "7") {
        if (validPositionsFromStart["-1,0"].includes(leftPipe)) {
            validNextPositions.push({ x: x - 1, y });
        }

        if (validPositionsFromStart["0,1"].includes(belowPipe)) {
            validNextPositions.push({ x, y: y + 1 });
        }
    } else if (pipeSymbolAtCurrentTile === "J") {
        if (validPositionsFromStart["-1,0"].includes(leftPipe)) {
            validNextPositions.push({ x: x - 1, y });
        }
        if (validPositionsFromStart["0,-1"].includes(abovePipe)) {
            validNextPositions.push({ x, y: y - 1 });
        }
    } else if (pipeSymbolAtCurrentTile === "F") {
        if (validPositionsFromStart["1,0"].includes(rightPipe)) {
            validNextPositions.push({ x: x + 1, y });
        }
        if (validPositionsFromStart["0,-1"].includes(belowPipe)) {
            validNextPositions.push({ x, y: y + 1 });
        }
    } else if (pipeSymbolAtCurrentTile === "L") {
        if (validPositionsFromStart["1,0"].includes(rightPipe)) {
            validNextPositions.push({ x: x + 1, y });
        }
        if (validPositionsFromStart["0,-1"].includes(abovePipe)) {
            validNextPositions.push({ x, y: y - 1 });
        }
    }

    if (previousPos) {
        return validNextPositions.filter((foundNextPos) => {
            return foundNextPos.x !== previousPos.x || foundNextPos.y !== previousPos.y;
        });
    } else {
        return validNextPositions;
    }
}

export type Coords2d = { x: number; y: number };

export function getDirectionsCanGoFromStartPosition(x: number, y: number, arr2d: string[][]): Coords2d[] {
    const leftPipe = arr2d[y][x - 1];
    const rightPipe = arr2d[y][x + 1];
    const abovePipe = arr2d[y - 1][x];
    const belowPipe = arr2d[y + 1][x];

    const validNextPositions: { x: number; y: number }[] = [];

    if (validPositionsFromStart["-1,0"].includes(leftPipe)) {
        validNextPositions.push({ x: x - 1, y: y });
    }

    if (validPositionsFromStart["1,0"].includes(rightPipe)) {
        validNextPositions.push({ x: x + 1, y: y });
    }

    if (validPositionsFromStart["0,-1"].includes(abovePipe)) {
        validNextPositions.push({ x: x, y: y - 1 });
    }

    if (validPositionsFromStart["0,1"].includes(belowPipe)) {
        validNextPositions.push({ x: x, y: y + 1 });
    }

    return validNextPositions;
}

function getPathsMap(arr2d: string[][]): { [key: string]: string[] } {
    let startingPosCoords: Coords2d;
    outerLoop: for (let y = 0; y < arr2d.length; y++) {
        for (let x = 0; x < arr2d[y].length; x++) {
            const currentTile = arr2d[y][x];
            if (currentTile === "S") {
                startingPosCoords = { x, y };
                break outerLoop;
            }
        }
    }

    let positionsCanGo = getDirectionsCanGoFromStartPosition(startingPosCoords!.x, startingPosCoords!.y, arr2d);

    const positionsPathsMap = {};

    for (let i = 0; i < positionsCanGo.length; i++) {
        let currentPathArr: Coords2d[] = [];

        let nextPos = positionsCanGo[i];
        let prevPos = startingPosCoords!;

        while (arr2d[nextPos.y][nextPos.x] !== "S") {
            const copyOfNextPos = { ...nextPos };
            nextPos = getNextPositions(nextPos.x, nextPos.y, arr2d, prevPos!)[0];
            prevPos = copyOfNextPos;
            currentPathArr.push(copyOfNextPos);
        }

        currentPathArr.push(nextPos);


        let pathKeyName = `path-${i + 1}`;
        // @ts-ignore
        positionsPathsMap[pathKeyName] = currentPathArr;
    }

    return positionsPathsMap;
}

(async () => {
    const absoluteFilePathSamplePuzzleInput = `${__dirname}/../../src/10/samplePuzzleInput.txt`;
    const puzzleInputAsStringArrLineByLine: string[] = await getFileLinesAsArr(absoluteFilePathSamplePuzzleInput);
    const puzzleInputAs2dArr = puzzleInputAsStringArrLineByLine.map((row: string) => {
        return row.split("").map((pipeSymbol: string) => pipeSymbol);
    });

    const pathsMap = getPathsMap(puzzleInputAs2dArr);
    console.log("paths map", pathsMap);
})();
