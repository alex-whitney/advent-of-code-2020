import * as _ from 'lodash';

import * as math from 'mathjs';
import * as u from '../lib/util';
import {Day} from '../lib/day';
import { print } from 'mathjs';

// Math! I wrote a naiive solution for p2, which would of course never terminate.
// The problem seemed super familiar to me. Tried for a bit to math out the approach,
// but it's been a long time...eventually just typed in a series of equations in Wolfram
// Alpha to get the answer...
//
//   (t+0)mod41=0, (t+35)mod37=0, etc
//
//    p1: 0:10:06 - rank 1774
//    p2: 1:29:09 - rank 2391

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    earliest: number
    busses: number[]
    wilds: number
    posBus: number[]
    indexedBusses: Map<number, number>
    initialize() {
        let input = this.readInput();
        let lines = input.split('\n');
        this.wilds = 0;
        this.earliest = parseInt(lines[0], 10);
        this.posBus = lines[1].split(',').map(n => {
            if (n !== 'x') {
                return parseInt(n, 10);
            } else {
                this.wilds++;
            }
        });
        this.busses = _.filter(this.posBus, v => v!==undefined);

        this.indexedBusses = new Map<number, number>();
        this.posBus.forEach((v, i) => {
            if (v) this.indexedBusses.set(i, v);
        });
    }

    executePart1(): string|number {
        let bus = 0;
        let ttw = Infinity;
        let time = Infinity;
        for (let b of this.busses) {
            let t = Math.ceil(this.earliest / b) * b
            if (t < time) {
                ttw = t - this.earliest;
                time = t;
                bus = b;
            }
        }

        return bus * ttw;
    }

    // Wrote later in the day.
    executePart2(): string|number {
        let step = this.indexedBusses.get(0);
        let t = step;

        this.indexedBusses.forEach((b, idx) => {
            if (idx === 0) return;
            
            while (true) {
                // on initial loop:
                //    (bus[0]*c + idx) % b
                //  will cycle through remainder values. Find the lowest C where the remainder
                //  is zero. t here represents bus[0]*c - each iteration increments c
                if ((t + idx) % this.indexedBusses.get(idx) === 0) {
                    console.log(`Found ${this.indexedBusses.get(idx)} at ${t}`);
                    // We can now increment by any value that is a multiple of b
                    // without changing the remainder. So incrementing
                    // t by (step*b) will ensure we still have (t+idx)%b=0
                    step = step * this.indexedBusses.get(idx);
                    break;
                } else {
                    t += step;
                    u.print(t);
                }
            }
        });

        return t;
    }
}
