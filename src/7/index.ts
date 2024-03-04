import { getFileLinesAsArr } from "../utils/getFileLinesAsArr";

enum EHandType {
    FIVE_OF_A_KIND,
    FOUR_OF_A_KIND,
    FULL_HOUSE,
    THREE_OF_A_KIND,
    TWO_PAIR,
    ONE_PAIR,
    HIGH_CARD
}

const CardValuesMap: { [key: string | number]: number } = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14
};

function getCardValue(card: string | number): number {
    return CardValuesMap[card];
}

function getCardHand(hand: string): EHandType {
    let map: { [key: string]: number } = {};
    hand.split("").forEach((char: string, i) => {
        if (!(char in map)) {
            map[char] = 1;
        } else {
            map[char]++;
        }
    });

    let findings: number[] = [];
    let vals = Object.values(map);
    for (let i = 0; i < vals.length; i++) {
        let n = vals[i];
        if (n === 5) {
            return EHandType.FIVE_OF_A_KIND;
        }

        if (n === 4) {
            return EHandType.FOUR_OF_A_KIND;
        }

        if (n === 3) {
            findings.push(3);
        }

        if (n === 2) {
            findings.push(2);
        }
        if (n === 1) {
            findings.push(1);
        }
    }

    findings.sort();

    if (findings[0] === 2 && findings[1] === 3) {
        return EHandType.FULL_HOUSE;
    }

    if (findings[0] === 1 && findings[1] === 1 && findings[2] === 3) {
        return EHandType.THREE_OF_A_KIND;
    }

    if (findings[0] === 1 && findings[1] === 2 && findings[2] === 2) {
        return EHandType.TWO_PAIR;
    }

    if (findings[0] === 1 && findings[1] === 1 && findings[2] === 1 && findings[3] === 2) {
        return EHandType.ONE_PAIR;
    }

    return EHandType.HIGH_CARD;
}

function getCardsWithHigherStrength(cardsA: string, cardsB: string) {
    for (let i = 0; i < cardsA.length; i++) {
        const currentCardA = cardsA.charAt(i);
        const currentCardB = cardsB.charAt(i);

        if (currentCardA === currentCardB) {
            continue;
        }

        if (CardValuesMap[currentCardA] > CardValuesMap[currentCardB]) {
            return cardsA;
        } else {
            return cardsB;
        }
    }
}

function getCardHandsInWeakestToStrongestOrder(dataSet: { [key: string]: number }) {
    let subSets: { [key: number]: string[] } = {};

    Object.keys(dataSet).forEach((val) => {
        let x = getCardHand(val);
        if (!(x in subSets)) {
            subSets[x] = [val];
        } else {
            subSets[x].push(val);
        }
    });

    return Object.values(subSets)
        .map((set: string[]) => {
            return set
                .sort((handA, handB) => {
                    if (getCardsWithHigherStrength(handA, handB) === handA) {
                        return 1;
                    } else {
                        return -1;
                    }
                })
                .reverse();
        })
        .flat()
        .reverse();
}

// sample data test

const samplePuzzleInputMap: { [key: string]: number } = {
    "32T3K": 765,
    T55J5: 684,
    KK677: 28,
    KTJJT: 220,
    QQQJA: 483
};

function getSumOfRankValues(mapDataSet: { [key: string]: number }): number {
    return getCardHandsInWeakestToStrongestOrder(mapDataSet)
        .map((hand: string, i) => {
            return mapDataSet[hand] * (i + 1);
        })
        .reduce((prev, acum) => {
            return prev + acum;
        });
}

(async () => {
    const absoluteFilePathPuzzleInput = `${__dirname}/../../src/7/puzzleInput.txt`;

    let puzzleInputAsArr: string[] = await getFileLinesAsArr(absoluteFilePathPuzzleInput);
    let puzzleInputMap: { [key: string]: number } = {};
    puzzleInputAsArr.forEach((line: string) => {
        const [cardHand, cardBidAmount] = line.split(" ");
        puzzleInputMap[cardHand] = Number(cardBidAmount);
    });
    console.log(`part 1 answer = ${getSumOfRankValues(puzzleInputMap)}`);
})();
