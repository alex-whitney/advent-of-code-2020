import * as _ from 'lodash';

import * as u from '../lib/util';
import {Day} from '../lib/day';

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

        let busses = {};
        this.posBus.forEach((v, i) => {
            if (v) busses[i] = v;
        });
        u.print(this.earliest)
        u.print(this.busses.length)
        u.print(busses);
        u.print(this.wilds)
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

    executePart2(): string|number {
        return "stop";
    }
}
