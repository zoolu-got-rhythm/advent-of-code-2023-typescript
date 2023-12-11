import { open as openFile } from "node:fs/promises";

type LowestOrHighest = "lowest" | "highest";
async function getHighestOrLowestColourQuantityMapsForEachGame(
    HighestOrLowestColourQuantities: LowestOrHighest
): Promise<Map<string, number>[]> {
    return new Promise(async (resolve, _) => {
        const absoluteFilePath = `${__dirname}/../../src/2/puzzleInputPart2.txt`;
        const file = await openFile(absoluteFilePath);

        const setsMatchRegex = /(\d+\s\w+(,\s)?)+/g;

        let setsArr: Map<string, number>[] = [];
        for await (const line of file.readLines()) {
            const sets = line.match(setsMatchRegex);

            const colourQuantityMap: Map<string, number> = new Map();

            sets?.forEach((set) => {
                // example of captured groups from 1 regex match: (5) (red)
                let quantityColourGroupsMatches = set.matchAll(/(\d+)\s(\w+)/g);

                for (const match of quantityColourGroupsMatches) {
                    const colour: string = match[2];
                    const quantity: number = Number(match[1]);
                    const currentColourMapVal = colourQuantityMap.get(colour);
                    colourQuantityMap.set(
                        colour,
                        HighestOrLowestColourQuantities === "highest"
                            ? Math.max(quantity, currentColourMapVal ? currentColourMapVal : 0)
                            : Math.min(quantity, currentColourMapVal ? currentColourMapVal : 10000) // arbitrary high number
                    );
                }
            });

            setsArr.push(colourQuantityMap);
        }

        resolve(setsArr);
    });
}

const sumIndiciesOfSetsThatPass = async (mapToTestAgainst: Map<string, number>) => {
    const setsArr = await getHighestOrLowestColourQuantityMapsForEachGame("highest");
    const sumOfIndiciesOfSetsThatPassTest = setsArr
        .filter((colourQuantityMap) => {
            return (
                colourQuantityMap.get("red")! <= mapToTestAgainst.get("red")! &&
                colourQuantityMap.get("green")! <= mapToTestAgainst.get("green")! &&
                colourQuantityMap.get("blue")! <= mapToTestAgainst.get("blue")!
            );
        })
        .map((colourQuantityMap) => {
            return setsArr.indexOf(colourQuantityMap) + 1;
        })
        .reduce((prev, acum) => prev + acum);

    return sumOfIndiciesOfSetsThatPassTest;
};

const sumOfPowersOfLowestColourQuantityMaps = async () => {
    const setsArr = await getHighestOrLowestColourQuantityMapsForEachGame("highest");

    const sumOfIndiciesOfSetsThatPassTest = setsArr
        .map((colourQuantityMap) => {
            return colourQuantityMap.get("red")! * colourQuantityMap.get("green")! * colourQuantityMap.get("blue")!;
        })
        .reduce((prev, acum) => prev + acum);

    return sumOfIndiciesOfSetsThatPassTest;
};

(async () => {
    const colourQuantityMapToTestAgainst = new Map<string, number>();
    colourQuantityMapToTestAgainst.set("red", 12);
    colourQuantityMapToTestAgainst.set("green", 13);
    colourQuantityMapToTestAgainst.set("blue", 14);

    console.log("part 1 answer =", await sumIndiciesOfSetsThatPass(colourQuantityMapToTestAgainst));
    console.log("part 2 answer =", await sumOfPowersOfLowestColourQuantityMaps());
})();

