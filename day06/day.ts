import * as _ from 'lodash';

import {Day} from '../lib/day';

// Speed attempt again!
//  p1: 5:12 - rank 1161
//  p2: 7:57 - rank 612

export default class DayImpl extends Day {
    groups: any[];

    constructor() {
        super(__dirname);
    }

    initialize() {
        let input = this.readInput();

        let groups = input.toString().split('\n\n');
        this.groups = [];
        for (let g of groups) {
            let rec = {
                questions: {},
                people: []
            };
            let ppl = g.split('\n');
            for (let p of ppl) {
                let person = {};
                for (let q of p) {
                    rec.questions[q] = true;
                    person[q] = true;
                }
                rec.people.push(person);
            }
            this.groups.push(rec);
        }
        
    }

    executePart1(): string {
        let c = 0;
        for (let x of this.groups) {
            c += _.keys(x.questions).length;
        }
        return c + "";
    }

    executePart2(): string {
        let c = 0;
        for (let x of this.groups) {
            let answers = {};
            for (let p of x.people) {
                for (let q of _.keys(p)) {
                    answers[q] = (answers[q] || 0) + 1;
                }
            }
            for (let a of _.keys(answers)) {
                if (answers[a] === x.people.length) {
                    c++;
                }
            }
        }
        return c + "";
    }
}
