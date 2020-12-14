import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';


// Uck. Lost time on p1 because I was using the example and didn't realize
// mask could be defined more than once. I'm about 1000% sure there was a better
// way to handle the masking / parsing of numbers as well.
//
// p2 was straightforward-ish. I was worried computation time was going to be long,
// but the inputs were pretty generous.
// 
//    p1: 00:23:57 - rank 2091
//    p2: 00:55:50 - rank 2105
//


export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    input: string[]
    initialize() {
        let input = this.readInput().split('\n');
        this.input = input;
    }

    dec2bin(dec:number):string{
        return (dec >>> 0).toString(2);
    }

    maskN(mask: string, n: number): number {
        let s = _.reverse(this.dec2bin(n).split(''));
        let ret = '';
        let m = _.reverse(mask.split(''));
        let len = Math.max(m.length, s.length);
        for (let i = 0; i < len; i++) {
            if (m[i] === 'X') {
                ret += s[i]||0;
            } else {
                ret += m[i]||0;   
            }
        }
        return parseInt(_.reverse(ret.split('')).join(''), 2);
    }

    maskAddr(mask: string, n: number): number[] {
        let s = _.reverse(this.dec2bin(n).split(''));
        let ret = '';
        let m = _.reverse(mask.split(''));

        let len = Math.max(mask.length, s.length);
        let masks = [];
        for (let i=0; i<_.countBy(mask)['X']; i++) {
            masks.push(_.clone(m))
            masks.push(_.clone(m))
        }
        for (let i = 0; i < mask.length; i++) {
            if (m[i] === 'X') {
                let newMasks = [];
                for (let om of masks) {
                    newMasks.push(_.cloneDeep(om));
                    om[i] = '0';
                    _.last(newMasks)[i] = '1';
                }
                masks = masks.concat(newMasks);
            }
        }
        for (let i = 0; i < len; i++) {
            if (m[i] === '0') {
                for (let mask of masks) {
                    mask[i] = s[i]||0;
                }
            } else if (m[i] === '1') {
                for (let mask of masks) {
                    mask[i] = '1';
                }
            }
        }
        return masks.map(m => {
            return parseInt(_.reverse(m).join(''), 2);
        });
    }

    executePart1(): string|number {
        let mem = new Map<number, number>();
        let mask: string;
        this.input.forEach(line => {
            let match = line.match(/mask = (.*)$/);
            if (match) {
                mask = match[1];
            } else {
                match = line.match(/mem\[(\d+)\] = (\d+)$/);
                let addr = parseInt(match[1], 10)
                let n = parseInt(match[2], 10);
                mem.set(addr, this.maskN(mask, n));
            }
        })
        let s = 0;
        mem.forEach((v, addr) => {
            s += v;
        })
        return s;
    }

    executePart2(): string|number {
        let mem = new Map<number, number>();

        let mask: string;
        this.input.forEach(line => {
            let match = line.match(/mask = (.*)$/);
            if (match) {
                mask = match[1];
            } else {
                match = line.match(/mem\[(\d+)\] = (\d+)$/);
                let addr = parseInt(match[1], 10)
                let n = parseInt(match[2], 10);
                let toSet = this.maskAddr(mask, addr);
                toSet.forEach(val => {
                    mem.set(val, n)
                });
            }
        })

        
        let s = 0;
        mem.forEach((v, addr) => {
            s += v;
        })
        return s;
    }
}
