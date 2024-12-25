// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
// S would be + pipe shape?

import path from "node:path";
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

function index2dIsInBounds(x: number, y: number, arr2d: string[][]): boolean {
    return Boolean(arr2d[y] && arr2d[y][x]);
}

export function getNextPosition(x: number, y: number, arr2d: string[][], previousPos: Coords2d): NextPosition {
    // console.log("x, y", x, y);
    const pipeSymbolAtCurrentTile = arr2d[y][x] as PipeSymbol;
    const leftPipe = index2dIsInBounds(x - 1, y, arr2d) ? arr2d[y][x - 1] : null;
    const rightPipe = index2dIsInBounds(x + 1, y, arr2d) ? arr2d[y][x + 1] : null;
    const abovePipe = index2dIsInBounds(x, y - 1, arr2d) ? arr2d[y - 1][x] : null;
    const belowPipe = index2dIsInBounds(x, y + 1, arr2d) ? arr2d[y + 1][x] : null;

    const validNextPositions = [];

    if (pipeSymbolAtCurrentTile === "-") {
        if (leftPipe && validPositionsFromStart["-1,0"].includes(leftPipe)) {
            validNextPositions.push({ x: x - 1, y });
        }

        if (rightPipe && validPositionsFromStart["1,0"].includes(rightPipe)) {
            validNextPositions.push({ x: x + 1, y });
        }
    } else if (pipeSymbolAtCurrentTile === "|") {
        if (abovePipe && validPositionsFromStart["0,-1"].includes(abovePipe)) {
            validNextPositions.push({ x, y: y - 1 });
        }

        if (belowPipe && validPositionsFromStart["0,1"].includes(belowPipe)) {
            validNextPositions.push({ x, y: y + 1 });
        }
    } else if (pipeSymbolAtCurrentTile === "7") {
        if (leftPipe && validPositionsFromStart["-1,0"].includes(leftPipe)) {
            validNextPositions.push({ x: x - 1, y });
        }

        if (belowPipe && validPositionsFromStart["0,1"].includes(belowPipe)) {
            validNextPositions.push({ x, y: y + 1 });
        }
    } else if (pipeSymbolAtCurrentTile === "J") {
        if (leftPipe && validPositionsFromStart["-1,0"].includes(leftPipe)) {
            validNextPositions.push({ x: x - 1, y });
        }
        if (abovePipe && validPositionsFromStart["0,-1"].includes(abovePipe)) {
            validNextPositions.push({ x, y: y - 1 });
        }
    } else if (pipeSymbolAtCurrentTile === "F") {
        if (rightPipe && validPositionsFromStart["1,0"].includes(rightPipe)) {
            validNextPositions.push({ x: x + 1, y });
        }
        if (belowPipe && validPositionsFromStart["0,1"].includes(belowPipe)) {
            validNextPositions.push({ x, y: y + 1 });
        }
    } else if (pipeSymbolAtCurrentTile === "L") {
        if (rightPipe && validPositionsFromStart["1,0"].includes(rightPipe)) {
            validNextPositions.push({ x: x + 1, y });
        }
        if (abovePipe && validPositionsFromStart["0,-1"].includes(abovePipe)) {
            validNextPositions.push({ x, y: y - 1 });
        }
    }

    if (previousPos) {
        let nextPos = validNextPositions.filter((foundNextPos) => {
            return foundNextPos.x !== previousPos.x || foundNextPos.y !== previousPos.y;
        })[0];
        return { ...nextPos, symbol: arr2d[nextPos.y][nextPos.x] };
    } else {
        let nextPos = validNextPositions[0];
        return { ...nextPos, symbol: arr2d[nextPos.y][nextPos.x] };
    }
}

export type Coords2d = { x: number; y: number };
type NextPosition = Coords2d & { symbol: string };

export function getDirectionsCanGoFromStartPosition(x: number, y: number, arr2d: string[][]): NextPosition[] {
    const leftPipe = arr2d[y][x - 1];
    const rightPipe = arr2d[y][x + 1];
    const abovePipe = arr2d[y - 1][x];
    const belowPipe = arr2d[y + 1][x];

    const validNextPositions: NextPosition[] = [];

    if (validPositionsFromStart["-1,0"].includes(leftPipe)) {
        validNextPositions.push({ x: x - 1, y: y, symbol: arr2d[y][x - 1] });
    }

    if (validPositionsFromStart["1,0"].includes(rightPipe)) {
        validNextPositions.push({ x: x + 1, y: y, symbol: arr2d[y][x + 1] });
    }

    if (validPositionsFromStart["0,-1"].includes(abovePipe)) {
        validNextPositions.push({ x: x, y: y - 1, symbol: arr2d[y - 1][x] });
    }

    if (validPositionsFromStart["0,1"].includes(belowPipe)) {
        validNextPositions.push({ x: x, y: y + 1, symbol: arr2d[y + 1][x] });
    }

    return validNextPositions;
}

function getPathsMap(arr2d: string[][]): { [key: string]: NextPosition[] } {
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

        // console.log("next pos", nextPos);
        while (arr2d[nextPos.y][nextPos.x] !== "S") {
            const copyOfNextPos = { ...nextPos };
            nextPos = getNextPosition(nextPos.x, nextPos.y, arr2d, prevPos!);
            // console.log("next pos", nextPos);

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

// function getIntersectingCoordinatesOfPaths(pathsMap: { [key: string]: string[] }): Coords2d {
//     for (let i = 0; i < pathsMap["path-1"].length; i++) {
//         // @ts-ignorets-ignore
//         const currentCoordsFromPath1 = pathsMap["path-1"][i] as Coords2d;
//         for (let j = 0; j < pathsMap["path-2"].length; j++) {
//             // @ts-ignore
//             const currentCoordsFromPath2 = pathsMap["path-2"][j] as Coords2d;
//             if (
//                 currentCoordsFromPath1.x === currentCoordsFromPath2.x &&
//                 currentCoordsFromPath1.y === currentCoordsFromPath2.y
//             ) {
//                 return currentCoordsFromPath1;
//             }
//         }
//     }

//     // @ts-ignore
//     return pathsMap["path-1"].filter((coords2d: Coords2d) => pathsMap["path-2"].includes(coords2d))[0];
// }

function getSymbolOfS(path: { [key: string]: NextPosition[] }) {
    const start = path["path-1"][path["path-1"].length - 1];
    const first = path["path-1"][0];
    const last = path["path-1"][path["path-1"].length - 2];

    const firstCoordsRelativeToStart = { x: first.x - start.x, y: first.y - start.y };
    const lastCoordsRelativeToStart = { x: last.x - start.x, y: last.y - start.y };

    // console.log("first", firstCoordsRelativeToStart);
    // console.log("last", lastCoordsRelativeToStart);

    function checkEitherWay(firstCoords: Coords2d, secondCoords: Coords2d, pos: Coords2d) {
        if (firstCoords.x === pos.x && firstCoords.y === pos.y) {
            return true;
        } else if (secondCoords.x === pos.x && secondCoords.y === pos.y) {
            return true;
        } else {
            return false;
        }
    }

    // right
    if (checkEitherWay(firstCoordsRelativeToStart, lastCoordsRelativeToStart, { x: 1, y: 0 })) {
        // and top
        if (checkEitherWay(firstCoordsRelativeToStart, lastCoordsRelativeToStart, { x: 0, y: -1 })) {
            return "L";
        }
        // and bottom
        if (checkEitherWay(firstCoordsRelativeToStart, lastCoordsRelativeToStart, { x: 0, y: 1 })) {
            return "F";
        }
        // and left
        if (checkEitherWay(firstCoordsRelativeToStart, lastCoordsRelativeToStart, { x: -1, y: 0 })) {
            return "-";
        }

        // right and left
    }

    // left
    if (checkEitherWay(firstCoordsRelativeToStart, lastCoordsRelativeToStart, { x: -1, y: 0 })) {
        // and top
        if (checkEitherWay(firstCoordsRelativeToStart, lastCoordsRelativeToStart, { x: 0, y: -1 })) {
            return "J";
        }
        // and bottom
        if (checkEitherWay(firstCoordsRelativeToStart, lastCoordsRelativeToStart, { x: 0, y: 1 })) {
            return "7";
        }
    }

    // top
    if (checkEitherWay(firstCoordsRelativeToStart, lastCoordsRelativeToStart, { x: -1, y: -1 })) {
        // and bottom
        if (checkEitherWay(firstCoordsRelativeToStart, lastCoordsRelativeToStart, { x: 0, y: 1 })) {
            return "|";
        }

        // if(path["path-1"][0])
    }
}

(async () => {
    const absoluteFilePathSamplePuzzleInput = `${__dirname}/../../src/10/puzzleInput.txt`;
    const puzzleInputAsStringArrLineByLine: string[] = await getFileLinesAsArr(absoluteFilePathSamplePuzzleInput);
    const puzzleInputAs2dArr = puzzleInputAsStringArrLineByLine.map((row: string) => {
        return row.split("").map((pipeSymbol: string) => pipeSymbol);
    });

    const pathsMap = getPathsMap(puzzleInputAs2dArr);
    let distanceFromStartingPoint = Math.ceil(pathsMap["path-1"].length / 2);
    console.log("part 1 answer =", distanceFromStartingPoint);

    // console.log("paths map", pathsMap);

    const symbolOfS = getSymbolOfS(pathsMap);
    // console.log("symbol of s", symbolOfS);

    const groundTerrain2dArr = puzzleInputAs2dArr.map((row, y) => {
        return row.map((columnItem, x) => {
            return ".";
        });
    });

    // console.log(groundTerrain2dArr);

    const groundTerrainWithJustPath = puzzleInputAs2dArr.map((row, y) => {
        return row.map((columnItem, x) => {
            let found = pathsMap["path-1"].find((nextPosObj) => {
                return nextPosObj.x === x && nextPosObj.y === y;
            });
            if (found) {
                if (found.symbol === "S") {
                    return getSymbolOfS(pathsMap);
                } else {
                    return found.symbol;
                }
            } else {
                return ".";
            }
        });
    });

    let countOfGroundTerrainInsideMaze = 0;
    groundTerrainWithJustPath.forEach((row, y) => {
        return row.forEach((columnItem, x) => {
            if (x === row.length - 1) return;

            if (columnItem === ".") {
                let nOfIntersects = 0;
                for (let i = x + 1; i < row.length - 1; i++) {
                    // console.log("i", i);
                    const currentSymbol = row[i];

                    if (currentSymbol === "|" || currentSymbol === "J" || currentSymbol === "L") {
                        nOfIntersects++;
                    }
                }
                if (nOfIntersects % 2 !== 0) {
                    // odd
                    countOfGroundTerrainInsideMaze++;
                }
            }
        });
    });

    // console.log(groundTerrainWithJustPath);
    console.log("part 2 answer = ", countOfGroundTerrainInsideMaze);
})();
