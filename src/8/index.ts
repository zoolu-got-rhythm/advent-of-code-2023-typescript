import { getAllFileLinesAsString } from "../utils/getFileLinesAsArr";

type NodeLookUpDataSet = { [key: string]: { L: string; R: string } };

// sample/example input
const nodeLookUpDataSetExample: NodeLookUpDataSet = {
    AAA: { L: "BBB", R: "BBB" },
    BBB: { L: "AAA", R: "ZZZ" },
    ZZZ: { L: "ZZZ", R: "ZZZ" }
};

const leftRightInstructionsExample = "LLR";

// problem set example input
const nodeLookUpDataSetExample2: NodeLookUpDataSet = {
    AAA: { L: "BBB", R: "CCC" },
    BBB: { L: "DDD", R: "EEE" },
    CCC: { L: "ZZZ", R: "GGG" },
    DDD: { L: "DDD", R: "DDD" },
    EEE: { L: "EEE", R: "EEE" },
    GGG: { L: "GGG", R: "GGG" },
    ZZZ: { L: "ZZZ", R: "ZZZ" }
};

const leftRightInstructionsExample2 = "RL";

function getNumberOfStepsTillDestinationNode(
    nodesDataSet: NodeLookUpDataSet,
    leftRightInstructions: string,
    startingNode: string,
    destinationNode: RegExp
): number | undefined {
    console.log("starting node", startingNode);
    let instructionsAsArr = leftRightInstructions.split("");
    let currentDestinationNode = startingNode;
    let steps = 0;
    while (!currentDestinationNode.match(destinationNode)) {
        let leftOrRight = instructionsAsArr[steps % instructionsAsArr.length] as "L" | "R";
        // console.log(leftOrRight);
        currentDestinationNode = nodesDataSet[currentDestinationNode][leftOrRight];
        // console.log("current dest note", currentDestinationNode);
        if (currentDestinationNode.match(destinationNode)) {
            return steps + 1;
        }
        steps++;
    }
}

function isWholeNumber(n: number) {
    let remainder = n % 2;
    return remainder === 0 || remainder === 1;
}

function getLowestCommonMultiplier(numbers: number[]) {
    // max
    const highestNumber = numbers.reduce((prev, acum) => (prev > acum ? prev : acum));

    let lcm = highestNumber;
    while (true) {
        let allNumbersDivisible = false;
        for (let j = 0; j < numbers.length; j++) {
            const n = numbers[j];
            if (isWholeNumber(lcm / n)) {
                allNumbersDivisible = true;
            } else {
                allNumbersDivisible = false;
                break;
            }
        }

        if (allNumbersDivisible) {
            return lcm;
        }

        lcm += highestNumber;
    }
}

const absoluteFilePathPuzzleInput = `${__dirname}/../../src/8/puzzleInput.txt`;

(async () => {
    const puzzleInputAsString: string = await getAllFileLinesAsString(absoluteFilePathPuzzleInput, true);
    const leftRightInstructions: string = puzzleInputAsString.match(/(L|R)+/g)![0];
    let nodeDataRows = puzzleInputAsString.match(/[A-Z]{3}\s=.*/g);

    let nodeLookUpDataSet: NodeLookUpDataSet = {};

    nodeDataRows?.forEach((nodeDataRow) => {
        const [key, left, right] = nodeDataRow.match(/[A-Z]{3}/g)!;
        nodeLookUpDataSet[key] = { L: left, R: right };
    });

    const nOfStepsToGetToZZZ = getNumberOfStepsTillDestinationNode(nodeLookUpDataSet, leftRightInstructions, "AAA", /ZZZ/);

    console.log(`part 1 result = ${nOfStepsToGetToZZZ}`);

    const startingNodesThatEndWithA: string[] = Object.keys(nodeLookUpDataSet).filter((node) => node.match(/..A/));
    const highestNumberOfStepsToGetToEndNode = startingNodesThatEndWithA.map((startingNode) =>
        getNumberOfStepsTillDestinationNode(nodeLookUpDataSet, leftRightInstructions, startingNode, /[A-Z][A-Z]Z/)
    ) as number[];

    console.log(`part 2 result = ${getLowestCommonMultiplier(highestNumberOfStepsToGetToEndNode)}`);
})();