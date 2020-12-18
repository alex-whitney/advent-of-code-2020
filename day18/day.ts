import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    fns: string[];
    initialize() {
        this.fns = this.readInput().split('\n');

    }

    evaluate(expr: string, part2: boolean): number {
        // find any parens, evaluate inner
        while (expr.includes('(')) {
            let first = expr.indexOf('(');
            let count = 1;
            for (let i = first+1; i < expr.length; i++) {
                if (expr.charAt(i) === '(') {
                    count++;
                } else if (expr.charAt(i) === ')') {
                    count--;
                }
                if (count === 0) {
                    let subexpr = expr.slice(first, i+1);
                    let result = this.evaluate(subexpr.slice(1, subexpr.length-1), part2);
                    expr = expr.replace(subexpr, result+"");
                    break;
                }
            }
            if (count > 0) throw 'something broke';
        }

        let tok = expr.split(' ');
        while (tok.length > 1) {
            let result: number;
            let idx = -1;

            if (!part2) {
                tok.forEach((v, i) => {
                    if (idx > -1) return;
                    if (v === '+' || v === '*') {
                        idx = i;
                    }
                });
                let op = tok[idx];
                if (op === '+') {
                    result = parseInt(tok[idx-1],10) + parseInt(tok[idx+1],10);
                } else if (op === '*') {
                    result = parseInt(tok[idx-1],10) * parseInt(tok[idx+1],10);
                }
            } else {
                if (tok.indexOf('+') > 0) {
                    idx = tok.indexOf('+');
                    result = parseInt(tok[idx-1],10) + parseInt(tok[idx+1],10);
                } else if (tok.indexOf('*') > 0) {
                    idx = tok.indexOf('*');
                    result = parseInt(tok[idx-1],10) * parseInt(tok[idx+1],10);
                } else {
                    throw 'what';
                }
            }

            let newTok = _.take(tok, idx-1);
            newTok.push(result+"");
            tok = newTok.concat(_.takeRight(tok, tok.length - idx - 2));
        }

        return parseInt(tok[0], 10);
    }

    executePart1(): string|number {
        return _.sum(this.fns.map(fn => {
            return this.evaluate(fn, false);
        }));
    }

    executePart2(): string|number {
        return _.sum(this.fns.map(fn => {
            return this.evaluate(fn, true);
        }));
    }
}
