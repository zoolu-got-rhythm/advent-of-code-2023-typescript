import { CategorySourceToDestinationMapType, getLocationFromSeedNumber } from "./getLocationFromSeedNumber.js";
import { workerData } from "node:worker_threads";
import { parentPort } from "node:worker_threads";

function getLowestLocationNumber(startRange: number, endRange: number, map: CategorySourceToDestinationMapType) {
    let lowestLocationNumber = 100000000000000000; // arbitrarily long/big number which something can be lower than

    for (let j = startRange; j < endRange; j++) {
        // console.log(`thread number ${workerData.threadNumber} progress = ${(j - startRange) / (endRange - startRange)}`)
        const locatinoNumber = getLocationFromSeedNumber(map, j);
        // console.log(`seed number is ${j}, corresponding location number is ${locatinoNumber}`);
        if (locatinoNumber < lowestLocationNumber) lowestLocationNumber = locatinoNumber;
    }

    parentPort!.postMessage(lowestLocationNumber);
}

getLowestLocationNumber(workerData.startRange, workerData.endRange, workerData.map);