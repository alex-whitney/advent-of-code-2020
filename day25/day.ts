import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';

const MAGIC = 20201227;

// This one was really easy, but from the description I was very confused about whether or not
// the 7 was something we were supposed to know or not. I was worried it would work on the sample
// input, but not the actual input, which means it would have been a little more difficult to 
// determine the loop number from both public keys.

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    cardPk: number
    doorPk: number
    
    initialize() {
        let input = this.readInput().split('\n').map(v => parseInt(v, 10));
        this.cardPk = input[0];
        this.doorPk = input[1];
    }

    determineLoopSize(subject: number, target: number): number {
        let counter = 0;
        let val = 1;
        while (val !== target) {
            val = this.transform(val, subject, 1);
            counter++;
        }
        return counter;
    }

    transform(value: number, subject: number, loopSize: number): number {
        let counter = 0;
        let val = value;
        while (counter < loopSize) {
            val = val * subject;
            val = val % MAGIC;
            counter++;
        }
        return val;
    }

    executePart1(): string|number {
        let cardLoop = this.determineLoopSize(7, this.cardPk);
        let cardEk = this.transform(1, this.doorPk, cardLoop);
        return cardEk;
    }

    executePart2(): string|number {
        return "";
    }
}
