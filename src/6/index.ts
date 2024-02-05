

// believe achieved this one in O(n) linear time, refactored from O(n2) originally (2 loops oppose to just 1)
function getDistanceTraveledGivenHoldTime(holdTimeInMs: number, totalRaceTime: number) {
    let steps = totalRaceTime - holdTimeInMs;
    return steps * holdTimeInMs;
}

function getHoldTimesThatWinGivenDistance(totalRaceTime: number, distanceToBeat: number, startHoldTime?: number) {
    let holdTimesThatWin = [];

    let isInThreshold = null;
    for (let i = startHoldTime || 1; i <= distanceToBeat; i++) {
        let distanceFromHoldTimeInMillimeters = getDistanceTraveledGivenHoldTime(i, totalRaceTime);
        if (distanceFromHoldTimeInMillimeters > distanceToBeat) {
            holdTimesThatWin.push(i);
            isInThreshold = true;
        } else {
            if (isInThreshold == true) {
                break;
            }
        }
    }
    return holdTimesThatWin;
}

function concatNumbersIntoNewSingleNumber(numbers: number[]): number {
    return Number(
        numbers
            .map((n) => {
                return String(n);
            })
            .join("")
    );
}

const puzzleInput = [
    { t: 49, d: 263 },
    { t: 97, d: 1532 },
    { t: 94, d: 1378 },
    { t: 94, d: 1851 }
];

console.log(`result 1 = ${
    puzzleInput
        // lengths of arrs as new arr
        .map((obj) => {
            return getHoldTimesThatWinGivenDistance(obj.t, obj.d).length;
        })
        // product
        .reduce((prev, acum) => {
            return prev * acum;
        })}`
);

const timeAllowedForRace = concatNumbersIntoNewSingleNumber(puzzleInput.map((obj) => obj.t));
const distanceToBeatInRace = concatNumbersIntoNewSingleNumber(puzzleInput.map((obj) => obj.d));

let startTime = Date.now();
console.log(`result 2 = ${getHoldTimesThatWinGivenDistance(timeAllowedForRace, distanceToBeatInRace, 1000000).length}`);
console.log(`time taken to compute result 2 = ${Date.now() - startTime}`);
