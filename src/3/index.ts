import { open as openFile } from "node:fs/promises";
import { resolve } from "node:path";

function hasAdjacentSpecialChar(arrIndex: number, charIndex: number, arr: string[]): boolean {
    return (
        isSpecialChar(arrIndex - 1, charIndex - 1, arr) ||
        isSpecialChar(arrIndex - 1, charIndex, arr) ||
        isSpecialChar(arrIndex - 1, charIndex + 1, arr) ||
        isSpecialChar(arrIndex, charIndex - 1, arr) ||
        isSpecialChar(arrIndex, charIndex, arr) ||
        isSpecialChar(arrIndex, charIndex + 1, arr) ||
        isSpecialChar(arrIndex + 1, charIndex - 1, arr) ||
        isSpecialChar(arrIndex + 1, charIndex, arr) ||
        isSpecialChar(arrIndex + 1, charIndex + 1, arr)
    );
}

function isSpecialChar(arrIndexToCheck: number, charIndexToCheck: number, arr: string[]): boolean {
    if (arr[arrIndexToCheck] === undefined) return false;
    if (arr[arrIndexToCheck].charAt(charIndexToCheck) === undefined) return false;

    const specialCharMatchRegex = /[^\d\.\n]/g;

    return Boolean(arr[arrIndexToCheck].charAt(charIndexToCheck).match(specialCharMatchRegex));
}

async function x(): Promise<number> {
    return new Promise(async (resolve, _) => {
        const absoluteFilePath = `${__dirname}/../../src/3/puzzleInput.txt`;
        const file = await openFile(absoluteFilePath);

        const linesArr: string[] = [];
        for await (const line of file.readLines()) {
            linesArr.push(line);
        }

        // console.log(linesArr);
        let gearNumbersArr = linesArr.map((row, rowIndex) => {
            // console.log("row", row);
            const matches = row.matchAll(/(\d+)/g);
            // console.log()

            let gearNumbers: number[] = [];
            for (const rowMatchInfoArr of matches) {
                let n = rowMatchInfoArr[1];
                let startingIndexOfN = rowMatchInfoArr.index;
                let endingIdexOfN = startingIndexOfN! + (n.length - 1);
                // console.log(n, startingIndexOfN, endingIdexOfN);

                for (let charIndex = startingIndexOfN!; charIndex <= endingIdexOfN; charIndex++) {
                    if (hasAdjacentSpecialChar(rowIndex, charIndex, linesArr)) {
                        // console.log(n + " is gear number");
                        gearNumbers.push(Number(n));
                        break;
                    }
                }
            }
            return gearNumbers;
        }).flat();
        // console.log("gear numbers", gearNumbersArr);

        resolve(gearNumbersArr.reduce((prev, acum) => prev + acum));
    });
}

(async () => {
    console.log("part 1 answer =", await x());
})();
