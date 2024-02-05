import { Worker } from "node:worker_threads";
import { InvalidKeyException } from "../utils/InvalidKeyException";
import { getAllFileLinesAsString } from "../utils/getFileLinesAsArr";
import { CategorySourceToDestinationMapType, getLocationFromSeedNumber } from "./getLocationFromSeedNumber";

async function getLowestLocationNumberFromSeeds(
    treatSeedsDataAsSeedAndRange: boolean,
    absoluteFilePath: string
): Promise<number> {
    return new Promise(async (resolve, _) => {
        const linesString: string = await getAllFileLinesAsString(absoluteFilePath);
        let seedsArr: number[] = (Array.from(linesString.matchAll(/seeds:\s((\d+\s?)+)/g))[0][1] as string)
            .split(" ")
            .map((numberAsString) => Number(numberAsString));

        // object structure will look like the following: (after processing)
        /* 
        let map = {
            seedToSoilMap: { <sourceNumber>: {source: <destinationSourceNumber>, range: <rangeNumber> },
            soilToFertilizerMap: { <sourceNumber>: {source: <destinationSourceNumber>, range: <rangeNumber> },
            etc...
        };
        */
        let map: CategorySourceToDestinationMapType = {};

        // build map
        for (const matches of linesString.matchAll(/((\w+-?)+\s\w+):(\n(\d+\s?)+)/g)) {
            let mappingsKey = matches[1]; // captured group from regex
            map[mappingsKey] = {};

            let multilineMatchDataForCurrentMappings: string = matches[3]; // another captured group from regex
            let dataLinesArr: string[] = multilineMatchDataForCurrentMappings.split("\n");
            dataLinesArr.forEach((line, i) => {
                if (i === 0 || i === dataLinesArr.length - 1) return;
                let destinationSourceRangeArr: string[] = line.split(" ");
                map[mappingsKey][Number(destinationSourceRangeArr[0])] = {
                    source: Number(destinationSourceRangeArr[1]),
                    range: Number(destinationSourceRangeArr[2])
                };
            });
        }

        const threads: Set<Worker> = new Set();

        let lowestLocationNumber = 100000000000000000; // arbitrarily long/big number which something can be lower than

        let GetLowestLocationNumberFromSeedsThreadArr: Promise<number>[] = [];

        if (treatSeedsDataAsSeedAndRange) {
            for (let i = 0; i < seedsArr.length; i += 2) {
                GetLowestLocationNumberFromSeedsThreadArr.push(
                    new Promise<number>((resolve, reject) => {
                        const workerThread = new Worker("./dist/5/getLowestLocationNumberInRangeWorkerFile.js", {
                            workerData: {
                                startRange: seedsArr[i],
                                endRange: seedsArr[i] + seedsArr[i + 1],
                                map: map,
                                threadNumber: i / 2
                            }
                        });

                        workerThread.on("online", () => {
                            console.log(`thread ${i / 2} started execution`);
                        });
                        workerThread.on("error", reject);
                        workerThread.on("exit", (code) => {
                            console.log(`thread ${i / 2} exited with code ${code}`);
                            // threads.delete(thread);
                            // console.log(`Thread exiting, ${threads.size} running...`);
                        });
                        workerThread.on("message", resolve);
                    })
                );
                // }
            }

            const lowestFoundLocationNumbersFromThreads: number[] = await Promise.all(
                GetLowestLocationNumberFromSeedsThreadArr
            );

            // take lowest location number of thread results
            lowestLocationNumber = lowestFoundLocationNumbersFromThreads.reduce((prev, acum) => (prev < acum ? prev : acum));
        } else {
            for (let i = 0; i < seedsArr.length; i++) {
                const locatinoNumber = getLocationFromSeedNumber(map, seedsArr[i]);
                if (locatinoNumber < lowestLocationNumber) lowestLocationNumber = locatinoNumber;
            }
        }

        resolve(lowestLocationNumber);
    });
}

const absoluteFilePathPuzzleInput = `${__dirname}/../../src/5/samplePuzzleInput.txt`;

(async () => {
    console.log("part 1 result =", await getLowestLocationNumberFromSeeds(false, absoluteFilePathPuzzleInput));
    console.log("part 2 result =", await getLowestLocationNumberFromSeeds(true, absoluteFilePathPuzzleInput));
})();
