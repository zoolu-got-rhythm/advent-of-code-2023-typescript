import { getFileLinesAsArr } from "../utils/getFileLinesAsArr";

(async () => {
    const absoluteFilePathSamplePuzzleInput = `${__dirname}/../../src/11/puzzleInput.txt`;
    const puzzleInputAsStringArrLineByLine: string[] = await getFileLinesAsArr(absoluteFilePathSamplePuzzleInput);
    const puzzleInputAs2dArr = puzzleInputAsStringArrLineByLine.map((row: string) => {
        return row.split("");
    });

    function createArrayOfNumbers0toN(n: number) {
        return Array.from({ length: n }, (_, index) => index);
    }

    // mark what columns to do expansion on
    let xWhiteList = createArrayOfNumbers0toN(puzzleInputAs2dArr[0].length);

    // mark what rows to do expansion on
    let yWhiteList = [];

    for (let y = 0; y < puzzleInputAs2dArr.length; y++) {
        let rowContainGalaxy = false;
        for (let x = 0; x < puzzleInputAs2dArr[y].length; x++) {
            if (puzzleInputAs2dArr[y][x] === "#") {
                // remove now from the white list for x axis
                xWhiteList[x] = -1;
                rowContainGalaxy = true;
            }
        }
        if (!rowContainGalaxy) {
            // add to white list for y axis
            yWhiteList.push(y);
        }
    }

    xWhiteList = xWhiteList.filter((n) => n > 0);

    let arrOfGalaxies: { x: number; y: number }[] = [];
    for (let y = 0; y < puzzleInputAs2dArr.length; y++) {
        for (let x = 0; x < puzzleInputAs2dArr[y].length; x++) {
            if (puzzleInputAs2dArr[y][x] === "#") {
                arrOfGalaxies.push({ x, y });
            }
        }
    }

    let part1sum = 0;
    let part2sum = 0;

    for (let i = 0; i < arrOfGalaxies.length; i++) {
        for (let j = i + 1; j < arrOfGalaxies.length; j++) {
            const expansionNumberToAddForX = xWhiteList.filter(
                (whiteListX) =>
                    whiteListX > Math.min(arrOfGalaxies[i].x, arrOfGalaxies[j].x) &&
                    whiteListX < Math.max(arrOfGalaxies[i].x, arrOfGalaxies[j].x)
            ).length;

            const expansionNumberToAddForY = yWhiteList.filter(
                (whiteListY) =>
                    whiteListY > Math.min(arrOfGalaxies[i].y, arrOfGalaxies[j].y) &&
                    whiteListY < Math.max(arrOfGalaxies[i].y, arrOfGalaxies[j].y)
            ).length;
       
            let xDiff = Math.abs(arrOfGalaxies[j].x - arrOfGalaxies[i].x);
            let yDiff = Math.abs(arrOfGalaxies[j].y - arrOfGalaxies[i].y);
            let totalDiffPart1 = xDiff + expansionNumberToAddForX + (yDiff + expansionNumberToAddForY);
            part1sum += totalDiffPart1;

            let totalDiffPart2 = xDiff + expansionNumberToAddForX * (1000000 - 1) + (yDiff + expansionNumberToAddForY * (1000000 - 1)); // why the minus 1?
            part2sum += totalDiffPart2;
        }
    }

    console.log("part 1 answer =", part1sum);
    console.log("part 2 answer =", part2sum);
})();
