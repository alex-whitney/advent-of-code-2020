import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';

// Went to bed before midnight, but kind of wish I had solved this under time.
// This problem seemed super simple, especially given the previous 2 days.
// Part 2 was free - it's a strict copy+paste with a different limit.

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    input:number[]
    initialize() {
        this.input = this.readInput().split(',').map(n => parseInt(n, 10))
        
    }

    executePart1(): string|number {
        let vals = new Map<number, number[]>();
        let counter = 0;
        let last: number;
        while (counter < 2020) {
            if (counter < this.input.length) {
                last = this.input[counter];
            } else {
                if (vals.has(last) && vals.get(last).length === 1) {
                    last = 0;
                } else {
                    last = _.nth(vals.get(last), -1) - _.nth(vals.get(last), -2);
                }
            }
            let u = vals.get(last) || []
            u.push(counter);
            vals.set(last, u);
            if (counter < 10) console.log(last)
            counter++;
        }
        return last;
    }

    executePart2(): string|number {
        let vals = new Map<number, number[]>();
        let counter = 0;
        let last: number;
        while (counter < 30000000) {
            if (counter < this.input.length) {
                last = this.input[counter];
            } else {
                if (vals.has(last) && vals.get(last).length === 1) {
                    last = 0;
                } else {
                    last = _.nth(vals.get(last), -1) - _.nth(vals.get(last), -2);
                }
            }
            let u = vals.get(last) || []
            u.push(counter);
            vals.set(last, u);
            if (counter < 10) console.log(last)
            counter++;
        }
        return last;
    }
}
