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

function substractStartsOfArrs(arr2d: number[][]): number {
    // console.log("arr2d", arr2d);

    let val = 0;
    // try {
    const endsOfArr = arr2d
        .slice(0, arr2d.length - 1)
        .map((arr) => {
            // console.log("start val", arr[0]);
            return arr[0];
        })
        .reverse();

    // console.log("ends of arr", endsOfArr);

    return endsOfArr.reduce((prev, acum) => {
        // console.log("acum", acum - );
        return acum - prev;
    });
    // } catch (e) {
    // console.log("error with this 2d arr", arr2d);
    // }
}

function getDiffArr(arr: number[]): number[] {
    let diffArr = [];
    for (let i = 0; i < arr.length - 1; i++) {
        diffArr.push(arr[i + 1] - arr[i]);
    }
    return diffArr;
}

/** example output: [ [ 3, 3, 5, 9, 15 ], [ 0, 2, 4, 6 ], [ 2, 2, 2 ], [ 0, 0 ] ] from input: [ 10, 13, 16, 21, 30, 45 ] */
function getAllDiffArrsUntilArrWithAllZerosIsReached(arr: number[]): number[][] {
    let parentArr = [];
    let diffArr = arr;
    while (!checkAllNumbersInArrAreZero(diffArr)) {
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

function extrapolatePreviousNumberInArr(arr: number[]) {
    let allDiffArrsUntilArrWithAllZeros: number[][] = getAllDiffArrsUntilArrWithAllZerosIsReached(arr);
    return arr[0] - substractStartsOfArrs(allDiffArrsUntilArrWithAllZeros);
}

const absoluteFilePathPuzzleInput = `${__dirname}/../../src/9/puzzleInput.txt`;

(async () => {
    const puzzleInputAsStringArrLineByLine: string[] = await getFileLinesAsArr(absoluteFilePathPuzzleInput);

    const puzzleInputAsNumbersArrs: number[][] = puzzleInputAsStringArrLineByLine.map((row: string) => {
        return row.split(" ").map((nAsString: string) => Number(nAsString));
    });
    const part1Result: number = puzzleInputAsNumbersArrs
        .map((rowArr: number[]) => extrapolateNextNumberInArr(rowArr))
        .reduce((prev, acum) => prev + acum);

    const part2Result: number = puzzleInputAsNumbersArrs
        .map((rowArr: number[]) => extrapolatePreviousNumberInArr(rowArr))
        .reduce((prev, acum) => prev + acum);

    console.log("part 1 result =", part1Result);
    console.log("part 2 result =", part2Result);
})();
