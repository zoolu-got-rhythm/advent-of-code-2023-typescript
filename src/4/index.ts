import { getFileLinesAsArr } from "../utils/getFileLinesAsArr";

function splitLineIntoScratchedAndCorrectAnswersArrs(line: string): [number[], number[]] {
    let lineWithoutCardText = line.replace(/Card\s+\d+:/g, "");
    let leftAndRightSide = lineWithoutCardText.split("|");

    let scratchedAnswers: number[] = leftAndRightSide[0]
        .split(" ")
        .filter((char) => char.length !== 0)
        .map((char) => Number(char));

    let correctAnswers: number[] = leftAndRightSide[1]
        .split(" ")
        .filter((char) => char.length !== 0)
        .map((char) => Number(char));

    return [scratchedAnswers, correctAnswers];
}

async function getTotalScratchCardWinsPoints(absoluteFilePath: string): Promise<number> {
    return new Promise(async (resolve, _) => {
        const linesArr: string[] = await getFileLinesAsArr(absoluteFilePath);

        let scratchCardPointsArr: number[] = linesArr.map((row, rowIndex) => {
            let [scratchedAnswers, correctAnswers] = splitLineIntoScratchedAndCorrectAnswersArrs(row);

            let points = 0;
            for (let i = 0; i < scratchedAnswers.length; i++) {
                if (correctAnswers.includes(scratchedAnswers[i])) {
                    if (points == 0) {
                        points = 1;
                    } else {
                        points = points * 2;
                    }
                }
            }

            return points;
        });

        // sum points
        resolve(scratchCardPointsArr.reduce((prev, acum) => prev + acum));
    });
}

async function countTotalScratchCardCopies(absoluteFilePath: string): Promise<number> {
    return new Promise(async (resolve, _) => {
        const linesArr: string[] = await getFileLinesAsArr(absoluteFilePath);
      
        let cardCopiesArr: number[] = [];

        linesArr.forEach((row, rowIndex) => {
            let [scratchedAnswers, correctAnswers] = splitLineIntoScratchedAndCorrectAnswersArrs(row);

            cardCopiesArr[rowIndex] =
                cardCopiesArr[rowIndex] !== undefined ? (cardCopiesArr[rowIndex] += 1) : (cardCopiesArr[rowIndex] = 1);
            let cardCopiesIndex = 0;

            for (let i = 0; i < scratchedAnswers.length; i++) {
                if (correctAnswers.includes(scratchedAnswers[i]) && rowIndex !== linesArr.length - 1) {
                    cardCopiesIndex++;
                    cardCopiesArr[rowIndex + cardCopiesIndex] =
                        cardCopiesArr[rowIndex + cardCopiesIndex] !== undefined
                            ? (cardCopiesArr[rowIndex + cardCopiesIndex] += cardCopiesArr[rowIndex])
                            : (cardCopiesArr[rowIndex + cardCopiesIndex] = cardCopiesArr[rowIndex]);
                }
            }
        });

        // sum card copies
        resolve(cardCopiesArr.reduce((prev, acum) => prev + acum));
    });
}

const absoluteFilePathPuzzleInput = `${__dirname}/../../src/4/puzzleInput.txt`;
const absoluteFilePathSamplePuzzleInput = `${__dirname}/../../src/4/samplePuzzleInput.txt`;

(async () => {
    console.log("part 1 answer =", await getTotalScratchCardWinsPoints(absoluteFilePathPuzzleInput));
    console.log("part 2 answer =", await countTotalScratchCardCopies(absoluteFilePathPuzzleInput));
})();
