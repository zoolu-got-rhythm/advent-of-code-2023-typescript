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

// const CardValuesMap: { [key: string | number]: number } = {
//     2: 2,
//     3: 3,
//     4: 4,
//     5: 5,
//     6: 6,
//     7: 7,
//     8: 8,
//     9: 9,
//     T: 10,
//     J: 11,
//     Q: 12,
//     K: 13,
//     A: 14
// };

function getCardValuesMap(switchJCardToBeLowestValue?: boolean): { [key: string | number]: number } {
    return {
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        T: 10,
        J: switchJCardToBeLowestValue ? 1 : 11,
        Q: 12,
        K: 13,
        A: 14
    };
}

function getCardValue(card: string | number, switchJCardToBeLowest?: boolean): number {
    let cardValuesMap = getCardValuesMap(switchJCardToBeLowest);
    return cardValuesMap[card];
}

function getCardHandWithJCardSubstitute(cardHand: string) {
    let cardsInHandArr = cardHand.split("");
    if (!cardsInHandArr.includes("J")) {
        return cardHand;
    } else {
        if (cardHand === "JJJJJ") return "AAAAA";

        let cardValueCountMap = getCardCountMap(cardHand);

        let cardWithMostCount = "";
        for (let card in cardValueCountMap) {
            if (card !== "J" && cardValueCountMap[card] > 1) {
                cardWithMostCount = card;
            }
        }

        // all cards in hand unique
        if (cardWithMostCount.length === 1) {
            return cardsInHandArr.map((card) => (card === "J" ? cardWithMostCount : card)).join("");
        } else {
            // find highest card, and turn J into that

            let cardWithHighestValue = cardsInHandArr.reduce((prev, acum) =>
                getCardValue(prev) > getCardValue(acum) ? prev : acum
            );
            return cardsInHandArr.map((card) => (card === "J" ? cardWithHighestValue : card)).join("");
        }
    }
}

function getCardCountMap(cardHand: string): { [key: string]: number } {
    let map: { [key: string]: number } = {};
    cardHand.split("").forEach((char: string, i) => {
        if (!(char in map)) {
            map[char] = 1;
        } else {
            map[char]++;
        }
    });
    return map;
}

function getCardHandType(hand: string): EHandType {
    let cardValueCountMap = getCardCountMap(hand);

    let findings: number[] = [];
    let vals = Object.values(cardValueCountMap);
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

function getCardsWithHigherStrength(cardsA: string, cardsB: string, switchJCardToBeLowest?: boolean) {
    let cardValuesMap = getCardValuesMap(switchJCardToBeLowest);
    for (let i = 0; i < cardsA.length; i++) {
        const currentCardA = cardsA.charAt(i);
        const currentCardB = cardsB.charAt(i);

        if (currentCardA === currentCardB) {
            continue;
        }

        if (cardValuesMap[currentCardA] > cardValuesMap[currentCardB]) {
            return cardsA;
        } else {
            return cardsB;
        }
    }
}

type KeyType = "originalHand" | "jWildCardHand";
interface CardValueMapping {
    originalHand: { [key: string]: EHandType };
    jWildCardHand: { [key: string]: EHandType };
    bidAmount: number;
}

function getCardHandsInWeakestToStrongestOrder(cardValueMappingsArr: CardValueMapping[], key: KeyType) {
    let subSets: { [key: number]: string[] } = {}; // [key: number] here is = [key: EHandType]

    cardValueMappingsArr.forEach((obj) => {
        // let x = getCardHandType(obj); // obj["original"] | obj[jWildCard]
        let keyForCardHandType: string = Object.keys(obj[key])[0]; // cardHand
        let cardHandType: EHandType = obj[key][keyForCardHandType]; // type of cardHand
        if (!(cardHandType in subSets)) {
            subSets[cardHandType] = [keyForCardHandType]
        } else {
            subSets[cardHandType].push(keyForCardHandType);
        }
    });

    return Object.values(subSets)
        .map((set: string[]) => {
            return set
                .sort((handA, handB) => {
                    if (getCardsWithHigherStrength(handA, handB, key === "jWildCardHand") === handA) {
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

function getSumOfRankValues(cardValueMappingsArr: CardValueMapping[], key: KeyType): number {
    return getCardHandsInWeakestToStrongestOrder(cardValueMappingsArr, key)
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

    let cardValueMappingsArr: CardValueMapping[] = [];
    puzzleInputAsArr.forEach((line: string) => {
        const [cardHand, cardBidAmount] = line.split(" ");

        let jWildCardHandVersion = getCardHandWithJCardSubstitute(cardHand);
        let obj: CardValueMapping = {
            originalHand: {},
            jWildCardHand: {},
            bidAmount: Number(cardBidAmount)
        };
        obj.originalHand[cardHand] = getCardHandType(cardHand);
        obj.jWildCardHand[jWildCardHandVersion] = getCardHandType(jWildCardHandVersion);

        cardValueMappingsArr.push(obj);
    });

    console.log(cardValueMappingsArr);

    console.log(`part 1 answer = ${getSumOfRankValues(cardValueMappingsArr, "original")}`);
    // console.log("test", getCardHandWithJCardSubstitute("KTJJT"));
    // console.log(cardToJWildCardMap);
})();
