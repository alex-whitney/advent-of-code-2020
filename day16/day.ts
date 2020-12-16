import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    rules: Map<string, [number, number][]>
    mine: number[]
    tickets: number[][]
    initialize() {
        let groups = this.readInput().split('\n\n');
        
        this.rules = new Map<string, [number, number][]>();
        for (let line of groups[0].split('\n')) {
            let m = line.match(/^(.*): (\d+)\-(\d+) or (\d+)\-(\d+)$/);
            this.rules.set(m[1], [
                [parseInt(m[2], 10), parseInt(m[3], 10)],
                [parseInt(m[4], 10), parseInt(m[5], 10)]
            ]);
        }

        this.mine = groups[1].split('\n')[1].split(',').map(v => parseInt(v, 10));
        this.tickets = groups[2].split('\n').slice(1).map(v => v.split(',').map(vv => parseInt(vv, 10)));
    }

    executePart1(): string|number {
        let sum = 0;
        this.tickets.forEach(t => {
            for (let n of t) {
                let valid = false;
                for (let rules of this.rules.values()) {
                    for (let rule of rules) {
                        if (n >= rule[0] && n <= rule[1]) {
                            valid = true;
                        }
                    }
                }
                if (!valid) {
                    sum += n;
                }
            }
        })
        return sum;
    }

    executePart2(): string|number {
        let possible = new Map<number, string[]>()
        let validCount = 0;
        this.tickets.forEach(t => {
            let p = new Map<number, string[]>();
            let ind = 0;
            let valid = true;
            for (let n of t) {
                let v = false;
                p.set(ind, []);
                this.rules.forEach((rules, name) => {
                    for (let rule of rules) {
                        if (n >= rule[0] && n <= rule[1]) {
                            p.get(ind).push(name);
                            v = true;
                            break;
                        }
                    }
                })
                ind++;
                valid = valid && v;
            }
            if (valid) {
                validCount++;
                p.forEach((valid, idx) => {
                    possible.set(idx, (possible.get(idx)||[]).concat(valid));
                });
            }

        });

        let valids = new Map<number, string[]>();
        for (let idx = 0; idx < this.mine.length; idx++) {
            valids.set(idx, []);
        }
        possible.forEach((p, idx) => {
            let counts = _.countBy(p);
            for (let rule in counts) {
                if (counts[rule] === validCount) {
                    valids.get(idx).push(rule);
                }
            }
        })
        let m = [];
        valids.forEach((arr, ind) => {
            m.push({
                ind,
                arr
            })
        });
        let sorted = _.sortBy(m, (e) => e.arr.length);
        let fields = {};
        let used = [];
        for (let el of sorted) {
            let unused = [];
            for (let item of el.arr) {
                if (used.indexOf(item) < 0) unused.push(item);
            }
            if (unused.length > 1) throw JSON.stringify(el);
            fields[el.ind] = unused[0];
            used.push(unused[0]);
        }
        console.log(fields);
        let prod = 1;
        for (let ind in fields) {
            if (fields[ind].match(/^departure/)) {
                prod = this.mine[ind] * prod;
            }
        }
        
        return prod;
    }
}
