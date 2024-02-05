function getDistanceTraveledGivenHoldTime(holdTimeInMs: number, totalRaceTime: number) {
    let totalDistanceTravelledInMillimeters = 0;
    for (let i = holdTimeInMs + 1; i < totalRaceTime; i++) {
        totalDistanceTravelledInMillimeters += holdTimeInMs;
    }
    totalDistanceTravelledInMillimeters += holdTimeInMs;
    return totalDistanceTravelledInMillimeters;
}

function getHoldTimesThatWinGivenDistance(totalRaceTime: number, distance: number) {
    let holdTimesThatWin = [];
    for (let i = 1; i <= distance; i++) {
        if (i % 1000 === 0) {
            console.log("progress=" + i / distance + "%");
        }
        let distanceFromHoldTimeInMillimeters = getDistanceTraveledGivenHoldTime(i, totalRaceTime);
        if (distanceFromHoldTimeInMillimeters > distance) {
            holdTimesThatWin.push(i);
            // continue;
        }
    }
    return holdTimesThatWin;
}

// console.log(getHoldTimesThatWinGivenDistance(30, 200));

const puzzleInput = [
    { t: 49, d: 263 },
    { t: 97, d: 1532 },
    { t: 94, d: 1378 },
    { t: 94, d: 1851 }
];

console.log(
    puzzleInput
        // lengths of arrs as new arr
        .map((obj) => {
            return getHoldTimesThatWinGivenDistance(obj.t, obj.d).length;
        })
        // product
        .reduce((prev, acum) => {
            return prev * acum;
        })
);

const t = Number(
    puzzleInput
        .map((obj) => {
            return String(obj.t);
        })
        .join("")
);

const d = Number(
    puzzleInput
        .map((obj) => {
            return String(obj.d);
        })
        .join("")
);

console.log(getHoldTimesThatWinGivenDistance(t, d).length);
