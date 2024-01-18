import { InvalidKeyException } from "../utils/InvalidKeyException";
import { getAllFileLinesAsString } from "../utils/getFileLinesAsArr";

type MapType = { [key: string]: { [key: number]: { source: number; range: number } } };

function getNextDestinationNumber(map: MapType, destinationToSourceMapKey: string, destinationLookUpNumber: number): number {
    if (!(destinationToSourceMapKey in map)) {
        throw new InvalidKeyException("key was not found/does not exist in destionation-to-source map");
    }

    // should always return a maximum array of length 1? or empty array
    let destinationToSourceMapKeys = Object.keys(map[destinationToSourceMapKey]).filter((key) => {
        return (
            destinationLookUpNumber >= map[destinationToSourceMapKey][Number(key)].source &&
            destinationLookUpNumber <=
                map[destinationToSourceMapKey][Number(key)].source + map[destinationToSourceMapKey][Number(key)].range
        );
    });

    if (destinationToSourceMapKeys.length === 0) {
        return destinationLookUpNumber;
    }

    const destinationKey = Number(destinationToSourceMapKeys[destinationToSourceMapKeys.length - 1]);
    const diff = destinationKey - map[destinationToSourceMapKey][destinationKey].source;

    return destinationLookUpNumber + diff;
}

function getLocationFromInitialSeedNumber(map: MapType, initialSeedNumber: number) {
    let location = initialSeedNumber;
    Object.keys(map).forEach((destinationToSourceMapKey: string) => {
        try {
            location = getNextDestinationNumber(map, destinationToSourceMapKey, location);
        } catch (error: any) {
            console.log("looking up key: " + destinationToSourceMapKey + ",", error.name + ":", error.message);
            process.exit(1);
        }
    });
    return location;
}

async function getLowestLocationNumberFromSeeds(
    treatSeedsDataAsSeedAndRange: boolean,
    absoluteFilePath: string
): Promise<number> {
    return new Promise(async (resolve, _) => {
        const linesString: string = await getAllFileLinesAsString(absoluteFilePath);
        let seedsArr: number[] = (Array.from(linesString.matchAll(/seeds:\s((\d+\s?)+)/g))[0][1] as string)
            .split(" ")
            .map((numberAsString) => Number(numberAsString));

        // let seedsArrFromRanges = [];

        // object structure will look like: (after processing)
        /* 
        let b = {
            seedToSoilMap: { 22234243: 333132343, 32332324: 453242341 },
            soilToFertilizerMap: { 43234243: 335132343, 12344324: 512342341 }
            etc...
        };
        */
        let map: MapType = {};

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

        let lowestLocationNumber = 100000000000000000; // arbitrarily long/big number which something can be lower than

        let count = 0;

        if (treatSeedsDataAsSeedAndRange) {
            for (let i = 0; i < seedsArr.length; i += 2) {
                console.log("range ", i);
                for (let j = seedsArr[i]; j < seedsArr[i] + seedsArr[i + 1]; j++) {
                    console.log(++count);
                    // console.log("j", j);
                    const locatinoNumber = getLocationFromInitialSeedNumber(map, j);
                    if (locatinoNumber < lowestLocationNumber) lowestLocationNumber = locatinoNumber;
                }
            }
        } else {
            for (let i = 0; i < seedsArr.length; i++) {
                const locatinoNumber = getLocationFromInitialSeedNumber(map, seedsArr[i]);
                if (locatinoNumber < lowestLocationNumber) lowestLocationNumber = locatinoNumber;
            }
        }

        // let lowestToHighest = seedsArr
        //     .map((initialSeedNumber: number) => {
        //         return getLocationFromInitialSeedNumber(map, initialSeedNumber);
        //     })
        //     .sort((a, b) => a - b);

        resolve(lowestLocationNumber);
    });
}

const absoluteFilePathPuzzleInput = `${__dirname}/../../src/5/puzzleInput.txt`;

(async () => {
    console.log("part 1 result =", await getLowestLocationNumberFromSeeds(false, absoluteFilePathPuzzleInput));
    console.log("part 2 result =", await getLowestLocationNumberFromSeeds(true, absoluteFilePathPuzzleInput));
})();
