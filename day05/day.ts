import * as _ from 'lodash';
import {Day} from '../lib/day';

// Speed attempt again!
//  Hit the STRUGGLE bus on bitwise operators! Been a long time since I've worked with
//  _bits_. Didn't realize + takes precedence over <<
//
//  p1: 18:08 - rank 3191
//  p2: 21:12 - rank 2390

export default class DayImpl extends Day {
    input: any[]
    seats: number[]

    constructor() {
        super(__dirname);
    }

    initialize() {
        let input = this.readInput();
        this.input = input.toString().split('\n');
        this.seats = [];
    }

    convertRow(val: string) {
        let row = val.slice(0, 7);
        
        let rowV = 0;
        for (let c of row) {
            if (c === 'B') {
                rowV = (rowV << 1) + 1;
            } else {
                rowV = (rowV << 1) + 0;
            }
        }
        return rowV;
    }

    convertColumn(val: string) {
        let col = val.slice(7);
        
        let colV = 0;
        for (let c of col) {
            if (c === 'R') {
                colV = (colV << 1) + 1;
            } else {
                colV = (colV << 1) + 0;
            }
        }
        return colV;
    }

    executePart1(): string {
        for (let r of this.input) {
            let row = this.convertRow(r);
            let col = this.convertColumn(r);
            let seat = row*8 + col;

            this.seats.push(seat);
        }
        
        return _.max(this.seats) + "";
    }

    executePart2(): string {
        let hash = {};
        for (let s of this.seats) {
            hash[s] = true;
        }

        for (let candidate = 2; candidate < 129*8; candidate++) {
            if (hash[candidate-1] && hash[candidate+1] && !hash[candidate]) {
                return candidate + "";
            }
        }

        return "";
    }
}
