import { getAllFileLinesAsString } from "../utils/getFileLinesAsArr";

type NodeLookUpDataSet = { [key: string]: { L: string; R: string } };

// sample/example input
const nodeLookUpDataSetExample: NodeLookUpDataSet = {
    AAA: { L: "BBB", R: "BBB" },
    BBB: { L: "AAA", R: "ZZZ" },
    ZZZ: { L: "ZZZ", R: "ZZZ" }
};

const leftRightInstructionsExample = "LLR";

// problem set input
const leftRightInstructionsExample2 = "RL";
const nodeLookUpDataSetExample2: NodeLookUpDataSet = {
    AAA: { L: "BBB", R: "CCC" },
    BBB: { L: "DDD", R: "EEE" },
    CCC: { L: "ZZZ", R: "GGG" },
    DDD: { L: "DDD", R: "DDD" },
    EEE: { L: "EEE", R: "EEE" },
    GGG: { L: "GGG", R: "GGG" },
    ZZZ: { L: "ZZZ", R: "ZZZ" }
};

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

// only works for even numbers?
function getLowestCommonMultiplier(numbers: number[]) {
   
    let i = 1;
    while (true) {
        let currentCommonMultiple = 0;
        console.log("current multiple", currentCommonMultiple);
        for (let j = 0; j < numbers.length; j++) {
            let n = numbers[j];
            if(currentCommonMultiple > 0){
                if((n * i !== currentCommonMultiple)){
                    break;
                }
            }else{
                currentCommonMultiple = n * i;
            }
            
            if(j === numbers.length - 1){
                return currentCommonMultiple;
            }
        }

        i++;
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
    // console.log(getLowestCommonMultiplier([4,10]));
})();

// console.log(getNumberOfStepsTillDestinationNode(nodeLookUpDataSet, leftRightInstructions, "ZZZ"));
