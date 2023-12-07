import { open as openFile } from "node:fs/promises";
import { SourceTextModule } from "node:vm";

type SearchType = "wordSearch" | "numberSearch";
// part 1
const x = async (searchType: SearchType) => {
    let firstLastNumbersOnEachLineAsDoubleDigits: number[] = [];
    const absoluteFilePath = `${process.cwd()}/src/1/puzzleInputPart1.txt`;
    const file = await openFile(absoluteFilePath);

    const numbersAsStrings: string[] = "zero one two three four five six seven eight nine".split(" ");
    for await (const line of file.readLines()) {
        let numberMatches: string[] = [];
        if (searchType === "numberSearch") {
            numberMatches = (line as string).match(/\d/g)!;
        } else {
            const numbersAsWordsMatches = (line as string).match(/one|two|three|four|five|six|seven|eight|nine/g);
            if (numbersAsWordsMatches === null) {
                console.log("line", line);
                continue;
            }
            numbersAsWordsMatches?.forEach((numberWord) => {
                numberMatches.push(String(numbersAsStrings.indexOf(numberWord)));
            });
        }
        const firstNumber = numberMatches[0];
        const secondNumber = numberMatches[numberMatches.length - 1];
        const doubleDigitString: string = firstNumber + secondNumber; // string concatenation
        const doubleDigitNumeric: number = Number(doubleDigitString);
        firstLastNumbersOnEachLineAsDoubleDigits.push(doubleDigitNumeric);
    }

    const sumOfDoubleDigits = firstLastNumbersOnEachLineAsDoubleDigits.reduce((prev, acum) => prev + acum);
    return sumOfDoubleDigits;
};

(async () => {
    console.log("part 1 answer =", await x("numberSearch"));
    console.log("part 2 answer =", await x("wordSearch"));
})();
