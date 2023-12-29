import { open as openFile } from "node:fs/promises";
import { resolve } from "node:path";

function hasAdjacentRegexSymbolChar(
    arrIndex: number,
    charIndex: number,
    arr: string[],
    symbolCharToMatchRegex: RegExp
): [number, number] | undefined {
    if (isRegexSymbolChar(arrIndex - 1, charIndex - 1, arr, symbolCharToMatchRegex)) {
        return [arrIndex - 1, charIndex - 1];
    }
    if (isRegexSymbolChar(arrIndex - 1, charIndex, arr, symbolCharToMatchRegex)) {
        return [arrIndex - 1, charIndex];
    }
    if (isRegexSymbolChar(arrIndex - 1, charIndex + 1, arr, symbolCharToMatchRegex)) {
        return [arrIndex - 1, charIndex + 1];
    }
    if (isRegexSymbolChar(arrIndex, charIndex - 1, arr, symbolCharToMatchRegex)) {
        return [arrIndex, charIndex - 1];
    }
    if (isRegexSymbolChar(arrIndex, charIndex, arr, symbolCharToMatchRegex)) {
        return [arrIndex, charIndex];
    }
    if (isRegexSymbolChar(arrIndex, charIndex + 1, arr, symbolCharToMatchRegex)) {
        return [arrIndex, charIndex + 1];
    }
    if (isRegexSymbolChar(arrIndex + 1, charIndex - 1, arr, symbolCharToMatchRegex)) {
        return [arrIndex + 1, charIndex - 1];
    }
    if (isRegexSymbolChar(arrIndex + 1, charIndex, arr, symbolCharToMatchRegex)) {
        return [arrIndex + 1, charIndex];
    }
    if (isRegexSymbolChar(arrIndex + 1, charIndex + 1, arr, symbolCharToMatchRegex)) {
        return [arrIndex + 1, charIndex + 1];
    }
}

function isRegexSymbolChar(
    arrIndexToCheck: number,
    charIndexToCheck: number,
    arr: string[],
    regexSymbolCharMatch: RegExp
): boolean {
    if (arr[arrIndexToCheck] === undefined) return false;
    if (arr[arrIndexToCheck].charAt(charIndexToCheck) === undefined) return false;
    return Boolean(arr[arrIndexToCheck].charAt(charIndexToCheck).match(regexSymbolCharMatch));
}

async function sumNumbersWithAdjacentSpecialChars(): Promise<number> {
    const specialCharMatchRegex = /[^\d\.\n]/g;

    return new Promise(async (resolve, _) => {
        const absoluteFilePath = `${__dirname}/../../src/3/puzzleInput.txt`;
        const file = await openFile(absoluteFilePath);

        const linesArr: string[] = [];
        for await (const line of file.readLines()) {
            // console.log("line length", line.length);

            linesArr.push(line);
        }

        // console.log(linesArr);
        let gearNumbersArr = linesArr
            .map((row, rowIndex) => {
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
                        if (hasAdjacentRegexSymbolChar(rowIndex, charIndex, linesArr, specialCharMatchRegex)) {
                            // console.log(n + " is gear number");
                            gearNumbers.push(Number(n));
                            break;
                        }
                    }
                }
                return gearNumbers;
            })
            .flat();
        // console.log("gear numbersz", gearNumbersArr.length);

        resolve(gearNumbersArr.reduce((prev, acum) => prev + acum));
    });
}

async function sumMultipliedNumbersWithAdjacentStarChar(): Promise<number> {
    const starCharMatchRegex = /\*/g;

    return new Promise(async (resolve, _) => {
        const absoluteFilePath = `${__dirname}/../../src/3/puzzleInput.txt`;
        const file = await openFile(absoluteFilePath);

        const linesArr: string[] = [];
        for await (const line of file.readLines()) {
            linesArr.push(line);
        }

        let map: { [key: string]: number[] } = {};

        linesArr.forEach((row, rowIndex) => {
            const matches = row.matchAll(/(\d+)/g);

            for (const rowMatchInfoArr of matches) {
                let n = rowMatchInfoArr[1];
                let startingIndexOfN = rowMatchInfoArr.index;
                let endingIdexOfN = startingIndexOfN! + (n.length - 1);

                for (let charIndex = startingIndexOfN!; charIndex <= endingIdexOfN; charIndex++) {
                    const gearSymbolRowAndColumnTuple = hasAdjacentRegexSymbolChar(
                        rowIndex,
                        charIndex,
                        linesArr,
                        starCharMatchRegex
                    );
                    if (gearSymbolRowAndColumnTuple) {
                        const [gearSymbolRow, gearSymbolColumn] = gearSymbolRowAndColumnTuple;

                        let key = String(gearSymbolRow) + ", " + String(gearSymbolColumn);
                        if (map[key] === undefined) {
                            map[key] = [];
                        }
                        map[key].push(Number(n));
                        break;
                    }
                }
            }
        });

        resolve(
            Object.keys(map)
                .map((key) => {
                    if (map[key].length > 1) {
                        return map[key][0] * map[key][1];
                    } else {
                        return 0;
                    }
                })
                .reduce((prev, acum) => prev + acum)
        );
    });
}

(async () => {
    console.log("part 1 answer =", await sumNumbersWithAdjacentSpecialChars());
    console.log("part 2 answer =", await sumMultipliedNumbersWithAdjacentStarChar());
})();
