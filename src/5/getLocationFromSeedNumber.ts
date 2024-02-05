import { InvalidKeyException } from "../utils/InvalidKeyException";

// almanac map type: see https://adventofcode.com/2023/day/5 for recap on what that is
export type CategorySourceToDestinationMapType = { [key: string]: { [key: number]: { source: number; range: number } } };

function getNextDestinationNumber(
    map: CategorySourceToDestinationMapType,
    destinationToSourceMapKey: string,
    destinationLookUpNumber: number
): number {
    // if (!(destinationToSourceMapKey in map)) {
    //     throw new InvalidKeyException("key was not found/does not exist in destionation-to-source map");
    // }

    // should always return a maximum array of length 1? or empty array
    let destinationToSourceMapKeys = Object.keys(map[destinationToSourceMapKey]).filter((key) => {
        return (
            destinationLookUpNumber >= map[destinationToSourceMapKey][Number(key)].source &&
            destinationLookUpNumber <
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

export function getLocationFromSeedNumber(map: CategorySourceToDestinationMapType, initialSeedNumber: number) {
    let location = initialSeedNumber;
    Object.keys(map).forEach((destinationToSourceMapKey: string) => {
        // try {
        location = getNextDestinationNumber(map, destinationToSourceMapKey, location);
        // } catch (error: any) {
        //     console.log("looking up key: " + destinationToSourceMapKey + ",", error.name + ":", error.message);
        //     process.exit(1);
        // }
    });
    return location;
}
