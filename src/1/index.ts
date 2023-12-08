import { open as openFile } from "node:fs/promises";

type SearchType = "wordAndNumberSearch" | "numberSearch";
const sumOfFirstAndLastDigitsFoundOnEachLine = async (searchType: SearchType) => {
    let firstLastNumbersOnEachLineAsDoubleDigits: number[] = [];
    const absoluteFilePath = `${process.cwd()}/src/1/puzzleInputPart1.txt`;
    const file = await openFile(absoluteFilePath);

    const numbersAsStrings: string[] = "zero one two three four five six seven eight nine".split(" ");
    for await (const line of file.readLines()) {
        let numberMatches: string[] = [];
        if (searchType === "numberSearch") {
            numberMatches = (line as string).match(/\d/g)!;
        } else {
            // else === "wordAndNumberSearch"
            const numbersAsWordsMatches = (line as string).match(
                /\d|(?<=o)ne|(?<=t)wo|(?<=t)hree|(?<=f)our|(?<=f)ive|(?<=s)ix|(?<=s)even|(?<=e)ight|(?<=n)ine/g // positive look behind's
            );
            if (numbersAsWordsMatches === null) {
                continue;
            }
            numbersAsWordsMatches.forEach((numberWordOrNumber: string) => {
                numberMatches.push(
                    String(
                        numberWordOrNumber.length > 1
                            ? numbersAsStrings.indexOf(
                                  numbersAsStrings.find((numberAsWordWithoutFirstLetter) =>
                                      numberAsWordWithoutFirstLetter.includes(numberWordOrNumber)
                                  )!
                              )
                            : numberWordOrNumber
                    )
                );
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
    console.log("part 1 answer =", await sumOfFirstAndLastDigitsFoundOnEachLine("numberSearch"));
    console.log("part 2 answer =", await sumOfFirstAndLastDigitsFoundOnEachLine("wordAndNumberSearch"));
})();
