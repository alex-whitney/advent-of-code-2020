import * as _ from 'lodash';

import * as u from '../lib/util';
import {Day} from '../lib/day';

// Pretty tired tonight - not processing too quickly. Got slowed down a lot in p1
// by a couple mistakes that took some time to figure out. P2 was a lot faster - but
// made an error (unsurprisingly) in the copy+paste hackjob of adj2()
//
//    p1: 27:48 - rank 2051
//    p2: 37:27 - rank 1344

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    input: string[][]
    initialize() {
        this.input = this.readInput().split('\n').map(ln => {
            return ln.split('');
        });
    }

    adj(seats: string[][], x: number, y: number): string[] {
        let arr = [];

        for (let i = x-1; i <= x+1; i++) {
            for (let j = y-1; j <= y+1; j++) {
                if (i >= 0 && i < seats.length) {
                    if (j >= 0 && j < seats[i].length && !(i==x && j==y)) {
                        arr.push(seats[i][j]);
                    }
                }
            }
        }

        return arr;
    }

    adj2(seats: string[][], x: number, y: number): string[] {
        let arr = [];
        for (let i=x+1; i<seats.length;i++) {
            if (seats[i][y]!=='.') {
                arr.push(seats[i][y]);
                break;
            }
        }
        for (let i=x-1; i>=0;i--) {
            if (seats[i][y]!=='.') {
                arr.push(seats[i][y]);
                break;
            }
        }
        for (let i=y+1; i<seats[x].length;i++) {
            if (seats[x][i]!=='.') {
                arr.push(seats[x][i]);
                break;
            }
        }
        for (let i=y-1; i>=0;i--) {
            if (seats[x][i]!=='.') {
                arr.push(seats[x][i]);
                break;
            }
        }
        for (let i=1; (x+i) < seats.length && (y+i) < seats[x].length; i++) {
            if (seats[x+i][y+i]!=='.') {
                arr.push(seats[x+i][y+i]);
                break;
            }
        }
        for (let i=1; (x-i) >= 0 && (y-i) >= 0; i++) {
            if (seats[x-i][y-i]!=='.') {
                arr.push(seats[x-i][y-i]);
                break;
            }
        }
        for (let i=1; (x-i) >= 0 && (y+i) < seats[x].length; i++) {
            if (seats[x-i][y+i]!=='.') {
                arr.push(seats[x-i][y+i]);
                break;
            }
        }
        for (let i=1; (x+i) < seats.length && (y-i) >= 0; i++) {
            if (seats[x+i][y-i]!=='.') {
                arr.push(seats[x+i][y-i]);
                break;
            }
        }

        return arr;
    }

    occ(seats: string[][]): string[][] {
        let ret = _.cloneDeep(seats);

        for (let x = 0; x < seats.length; x++) {
            for (let y = 0; y < seats[x].length; y++) {
                let adj = _.countBy(this.adj(seats, x, y))
                if (seats[x][y] === 'L' && !adj['#']) {
                    ret[x][y] = '#';
                } else if (seats[x][y] === '#' && adj['#'] >= 4) {
                    ret[x][y] = 'L';
                }
            }
        }

        return ret;
    }

    occ2(seats: string[][]): string[][] {
        let ret = _.cloneDeep(seats);

        for (let x = 0; x < seats.length; x++) {
            for (let y = 0; y < seats[x].length; y++) {
                let adj = _.countBy(this.adj2(seats, x, y))
                if (seats[x][y] === 'L' && !adj['#']) {
                    ret[x][y] = '#';
                } else if (seats[x][y] === '#' && adj['#'] >= 5) {
                    ret[x][y] = 'L';
                }
            }
        }

        return ret;
    }

    tostr(seats: string[][]): string {
        let s = "";
        seats.forEach(l => {
            s += l.join();
        });
        return s;
    }

    executePart1(): string|number {
        let res = this.input;
        let terminate = false;
        while (!terminate) {
            let newRes = this.occ(res);
            terminate = (this.tostr(res) === this.tostr(newRes));
            res = newRes;
        }

        return _.countBy(this.tostr(res))['#'];
    }

    executePart2(): string|number {
        let res = this.input;
        let terminate = false;
        while (!terminate) {
            let newRes = this.occ2(res);
            terminate = (this.tostr(res) === this.tostr(newRes));
            res = newRes;
        }

        return _.countBy(this.tostr(res))['#'];
    }
}
