import { open as openFile } from "node:fs/promises";

// part 1
(async () => {
    let firstLastNumbersOnEachLineAsDoubleDigits: number[] = [];
    const absoluteFilePath = `${process.cwd()}/src/1/puzzleInputPart1.txt`;
    const file = await openFile(absoluteFilePath);

    for await (const line of file.readLines()) {
        const numberMatches: string[] = (line as string).match(/\d/g)!;
        const firstNumber = numberMatches[0];
        const secondNumber = numberMatches[numberMatches.length - 1];
        const doubleDigitString: string = firstNumber + secondNumber; // string concatenation
        const doubleDigitNumeric: number = Number(doubleDigitString);
        firstLastNumbersOnEachLineAsDoubleDigits.push(doubleDigitNumeric);
    }

    const sumOfDoubleDigits = firstLastNumbersOnEachLineAsDoubleDigits.reduce(
        (prev, acum) => prev + acum,
    );

    console.log("sum of double digit numbers for part 1 =", sumOfDoubleDigits);
})();
