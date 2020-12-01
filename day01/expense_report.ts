import {readFileSync} from 'fs';

interface Pair {
    first: number
    second: number
}

interface Triplet {
    first: number
    second: number
    third: number
}

function getInput(): number[] {
    let contents = readFileSync(__dirname + "/expense_input.txt");
    let arr: string[] = contents.toString().split('\n');
    return arr.map(v => {
        return parseInt(v, 10);
    });
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

function main() {
    let list = getInput();
    
    console.log('** PART 1 **')
    let pair = findEntryPair(2020, list);
    console.log(`First number: ${pair.first}`);
    console.log(`Second number: ${pair.second}`);
    console.log(`Product: ${pair.first * pair.second}`);

    console.log()
    console.log('** PART 2 **')
    let triplet = findEntryTriplet(2020, list);
    console.log(`First number: ${triplet.first}`);
    console.log(`Second number: ${triplet.second}`);
    console.log(`Third number: ${triplet.third}`);
    console.log(`Product: ${triplet.first * triplet.second * triplet.third}`);
}

main();
