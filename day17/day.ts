import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    // z, y, x
    states: any
    initialSize: number;
    initialize() {
        this.states = {0: {}};
        this.readInput().split('\n').forEach((val, y) => {
            this.states[0][y] = {};
            val.split('').forEach((v, x) => this.states[0][y][x] = v);
        });
        this.initialSize = _.keys(this.states[0]).length;
        u.print(this.states);
    }

    neighbors(arr: any, x: number, y: number, z: number): string[] {
        let ret = [];
        for (let zo of _.range(-1, 2)) {
            for (let yo of _.range(-1, 2)) {
                for (let xo of _.range(-1, 2)) {
                    if (zo === 0 && yo === 0 && xo === 0) {
                        continue;
                    }
                    let val;
                    try {
                        val = arr[zo+z][yo+y][xo+x];
                        ret.push(arr[zo+z][yo+y][xo+x]);
                    } catch {}
                }
            }
        }
        return ret;
    }

    next(arr: any, iteration: number): any {
        arr = _.cloneDeep(arr);
        for (let z of _.range(-iteration, iteration+1)) {
            if (!(z in arr)) arr[z] = {};
            for (let y of _.range(-iteration, iteration+this.initialSize)) {
                if (!(y in arr[z])) arr[z][y] = {};
                for (let x of _.range(-iteration, iteration+this.initialSize)) {
                    if (!(x in arr[z][y])) arr[z][y][x] = '.';
                }
            }
        }

        let newArr = _.cloneDeep(arr);
        for (let z of _.range(-iteration, iteration+1)) {
            for (let y of _.range(-iteration, iteration+this.initialSize)) {
                for (let x of _.range(-iteration, iteration+this.initialSize)) {
                    let neighbors = _.countBy(this.neighbors(arr, x, y, z));
                    let val = arr[z][y][x];
                    if (val === '#') {
                        if (neighbors['#'] !== 2 && neighbors['#'] !== 3) {
                            newArr[z][y][x] = '.';
                        }
                    } else if (val === '.') {
                        if (neighbors['#'] === 3) {
                            newArr[z][y][x] = '#';
                        }
                    }
                }
            }
        }


        return newArr;
    }

    executePart1(): string|number {
        let arr = this.states;
        for (let iter of _.range(1, 7)) {
            arr = this.next(arr, iter);

            for (let z of _.keys(arr).sort()) {
                //u.print('z=' + z)
                for (let y of _.keys(arr[z]).sort()) {
                    let out = '';
                    for (let x of _.keys(arr[z][y]).sort()) {
                        out += arr[z][y][x];
                    }
                    //u.print(out);
                }
            }
        }
        let count = 0;
        for (let z of _.keys(arr).sort()) {
            for (let y of _.keys(arr[z]).sort()) {
                for (let x of _.keys(arr[z][y]).sort()) {
                    if (arr[z][y][x] === '#') count++;
                }
            }
        }
        return count;
    }

    neighbors2(arr: any, w: number, x: number, y: number, z: number): string[] {
        let ret = [];
        for (let wo of _.range(-1, 2)) {
            for (let zo of _.range(-1, 2)) {
                for (let yo of _.range(-1, 2)) {
                    for (let xo of _.range(-1, 2)) {
                        if (wo === 0 && zo === 0 && yo === 0 && xo === 0) {
                            continue;
                        }
                        let val;
                        try {
                            val = arr[wo+w][zo+z][yo+y][xo+x];
                            ret.push(val);
                        } catch {}
                    }
                }
            }
        }
        return ret;
    }

    next2(arr: any, iteration: number): any {
        arr = _.cloneDeep(arr);
        for (let w of _.range(-iteration, iteration+1)) {
            if (!(w in arr)) arr[w] = {};
            for (let z of _.range(-iteration, iteration+1)) {
                if (!(z in arr[w])) arr[w][z] = {};
                for (let y of _.range(-iteration, iteration+this.initialSize)) {
                    if (!(y in arr[w][z])) arr[w][z][y] = {};
                    for (let x of _.range(-iteration, iteration+this.initialSize)) {
                        if (!(x in arr[w][z][y])) arr[w][z][y][x] = '.';
                    }
                }
            }
        }

        let newArr = _.cloneDeep(arr);
        for (let w of _.range(-iteration, iteration+1)) {
            for (let z of _.range(-iteration, iteration+1)) {
                for (let y of _.range(-iteration, iteration+this.initialSize)) {
                    for (let x of _.range(-iteration, iteration+this.initialSize)) {
                        let neighbors = _.countBy(this.neighbors2(arr, w, x, y, z));
                        let val = arr[w][z][y][x];
                        if (val === '#') {
                            if (neighbors['#'] !== 2 && neighbors['#'] !== 3) {
                                newArr[w][z][y][x] = '.';
                            }
                        } else if (val === '.') {
                            if (neighbors['#'] === 3) {
                                newArr[w][z][y][x] = '#';
                            }
                        }
                    }
                }
            }
        }


        return newArr;
    }

    executePart2(): string|number {
        let arr: any = {
            0: _.cloneDeep(this.states)
        };
        for (let iter of _.range(1, 7)) {
            arr = this.next2(arr, iter);
        }
        let count = 0;
        for (let w in arr) {
            for (let z in arr[w]) {
                for (let y in arr[w][z]) {
                    for (let x in arr[w][z][y]) {
                        if (arr[w][z][y][x] === '#') count++;
                    }
                }
            }
        }
        return count;
    }
}
