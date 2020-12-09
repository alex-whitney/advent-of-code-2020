import * as _ from 'lodash';

import {Day} from '../lib/day';

// Goal: Back into the 3 digits!
//
// Careless mistakes on p2! Not a bad showing for p1 though.
//  
//    p1: 5:32 - rank 582
//    p2: 15:57 - rank 1469
//

export default class DayImpl extends Day {
    vals: number[]

    constructor() {
        super(__dirname);
    }

    initialize() {
        let input = this.readInput();
        this.vals = input.split('\n').map(s => {
            return parseInt(s, 10);
        });
    }

    find(ind: number): boolean {
        for (let i = ind - 25; i < ind; i++) {
            for (let j = i+1; j < ind; j++) {
                let sum = this.vals[i] + this.vals[j];
                if (sum === this.vals[ind]) return true;
            }
        }
        return false;
    }

    executePart1(): string {
        for (let i = 25; i < this.vals.length; i++) {
            if (!this.find(i)) {
                return this.vals[i] + "";
            }
        }
        return "FAIL";
    }

    executePart2(): string {
        let target = 177777905;
        for (let low = 0; low < this.vals.length; low++) {
            let sum = 0;
            let min = Infinity;
            let max = 0;
            for (let high = low; high < this.vals.length; high++) {
                let v = this.vals[high];
                sum += v;
                min = min < v ? min : v;
                max = max < v ? v : max;
                if (sum > target) break;
                if (sum === target && high-low > 0) {
                    return (min+max)+""
                } 
            }
        }
        return "Fail";
    }
}
