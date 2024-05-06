import { getFileLinesAsArr } from "../utils/getFileLinesAsArr";

function sumEndsOfArrs(arr2d: number[][]): number {
    let val = 0;
    // try {
    val = arr2d
        .slice(0, arr2d.length - 1)
        .map((arr) => arr[arr.length - 1])
        .reduce((prev, acum) => prev + acum);
    // } catch (e) {
    // console.log("error with this 2d arr", arr2d);
    // }
    return val;
}

function getDiffArr(arr: number[]): number[] {
    let diffArr = [];
    for (let i = 0; i < arr.length - 1; i++) {
        diffArr.push(arr[i + 1] - arr[i]);
    }
    return diffArr;
}

// TODO: is this name accurate/good enough?
function getAllDiffArrsUntilArrWithAllZerosIsReached(arr: number[]): number[][] {
    let parentArr = [];
    let diffArr = arr;
    while (!checkAllNumbersInArrAreZero(diffArr)) {
        // the gotcha' could be here
        diffArr = getDiffArr(diffArr);
        parentArr.push(diffArr);
    }

    return parentArr;
}

function checkAllNumbersInArrAreZero(arr: number[]): boolean {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] !== 0) return false;
    }
    return true;
}

const testDataSampleA = [10, 13, 16, 21, 30, 45];
const testDataSampleB = [1, 3, 6, 10, 15, 21];

function extrapolateNextNumberInArr(arr: number[]) {
    let allDiffArrsUntilArrWithAllZeros: number[][] = getAllDiffArrsUntilArrWithAllZerosIsReached(arr);
    return sumEndsOfArrs(allDiffArrsUntilArrWithAllZeros) + arr[arr.length - 1];
}

// console.log("next =", extrapolateNextNumberInArr(testDataSampleA));
// console.log("next =", extrapolateNextNumberInArr(testDataSampleB));

const absoluteFilePathPuzzleInput = `${__dirname}/../../src/9/puzzleInput.txt`;

(async () => {
    const puzzleInputAsStringArrLineByLine: string[] = await getFileLinesAsArr(absoluteFilePathPuzzleInput);

    const puzzleInputAsNumbersArrs: number[][] = puzzleInputAsStringArrLineByLine.map((row: string) => {
        return row.split(" ").map((nAsString: string) => Number(nAsString));
    });
    const part1Result: number = puzzleInputAsNumbersArrs
        .map((rowArr: number[]) => extrapolateNextNumberInArr(rowArr))
        .reduce((prev, acum) => prev + acum);

    console.log("part 1 result =", part1Result);
 
})();
