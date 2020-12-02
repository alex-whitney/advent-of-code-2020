import {Day} from '../lib/day';

interface Pair {
    first: number
    second: number
}

interface Triplet {
    first: number
    second: number
    third: number
}

function findEntryPair(targetNumber: number, list: number[]): Pair {
    let hash = {};
    for (let val of list) {
        hash[val] = true
    }

    for (let second of list) {
        let first = targetNumber - second;
        if (first in hash) {
            return {
                first,
                second
            };
        }
    }

    throw new Error('Did not find a suitable pair of numbers in the list');
}

function findEntryTriplet(targetNumber: number, list: number[]): Triplet {
    for (let third of list) {
        try {
            let pair = findEntryPair(targetNumber - third, list);
            return {
                first: pair.first,
                second: pair.second,
                third
            }
        } catch (err) {
            // ignore
        }
    }
    throw new Error('Did not find a suitable triplet of numbers in the list');
}

export default class DayImpl extends Day {
    input: number[];

    constructor() {
        super(__dirname);
    }

    initialize() {
        let input = this.readInput();
        let arr: string[] = input.toString().split('\n');
        this.input = arr.map(v => {
            return parseInt(v, 10);
        });
    }

    executePart1(): string {
        let pair = findEntryPair(2020, this.input);
        return pair.first * pair.second + "";
    }

    executePart2(): string {
        let triplet = findEntryTriplet(2020, this.input);
        return triplet.first * triplet.second * triplet.third + "";
    }
}
