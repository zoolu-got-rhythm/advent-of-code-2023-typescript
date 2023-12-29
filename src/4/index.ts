import { open as openFile } from "node:fs/promises";
import { resolve } from "node:path";


async function getTotalScratchCardWinsPoints(): Promise<number> {

    return new Promise(async (resolve, _) => {
        const absoluteFilePath = `${__dirname}/../../src/4/puzzleInput.txt`;
        const file = await openFile(absoluteFilePath);

        const linesArr: string[] = [];
        for await (const line of file.readLines()) {
            linesArr.push(line);
        }

        let points = linesArr.map((row, rowIndex) => {
            let lineWithoutCardText = row.replace(/Card\s\d+:/g, "");
            let leftAndRightSide = lineWithoutCardText.split("|");

            let scratchedAnswers = leftAndRightSide[0].split(" ").filter(char => char.length !== 0).map(char => Number(char));
            let correctAnswers = leftAndRightSide[1].split(" ").filter(char => char.length !== 0).map(char => Number(char));

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

        resolve(points.reduce((prev, acum) => prev + acum));
    });
}

(async () => {
    console.log("part 1 answer =", await getTotalScratchCardWinsPoints());
})();
