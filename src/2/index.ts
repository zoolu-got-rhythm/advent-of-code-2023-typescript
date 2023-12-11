import { open as openFile } from "node:fs/promises";

const sumIndiciesOfSetsThatPass = async (mapToTestAgainst: Map<string, number>) => {
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
                colourQuantityMap.set(colour, Math.max(quantity, currentColourMapVal ? currentColourMapVal : 0));
            }
        });

        setsArr.push(colourQuantityMap);
    }

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

(async () => {
    const colourQuantityMapToTestAgainst = new Map<string, number>();
    colourQuantityMapToTestAgainst.set("red", 12);
    colourQuantityMapToTestAgainst.set("green", 13);
    colourQuantityMapToTestAgainst.set("blue", 14);

    console.log("part 1 answer =", await sumIndiciesOfSetsThatPass(colourQuantityMapToTestAgainst));
})();
