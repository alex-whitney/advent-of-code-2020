import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';

// Challenge: generalize for n-dimensions and try for the highest n computable (in a reasonable time)

class Point {
    position: number[]

    constructor(p: number[]) {
        this.position = p;
    }

    generateNeighbors(): Point[] {
        // todo: preallocate length
        let up = Math.pow(3, this.position.length);
        let n = new Array(up - 1);
        let counter = 0;
        for (let x = 1; x < up; x++) {
            let digits = x.toString(3).padStart(this.position.length, '0').split('');
            let newPt = this.clone();
            digits.forEach((op, dim) => {
                if (op === '1') {
                    newPt.position[dim] = this.position[dim] - 1;
                } else if (op === '2') {
                    newPt.position[dim] = this.position[dim] + 1;
                }
            });
            n[counter++] = newPt;
        }
        return n;
    }

    clone(): Point {
        return new Point(_.clone(this.position));
    }

    getNumberOfReflections(): number {
        let count = 0;
        this.position.forEach((v, idx) => {
            if (idx < (this.position.length - 2) && v > 0) count++;
        });
        return Math.pow(2, count);
    }

    isBelowPlane(): boolean {
        let below = true;
        for (let x = 0; x < this.position.length - 2; x++) {
            below = below && (this.position[x] < 0);
        }
        return below;
    }

    isOnPlane(): boolean {
        for (let x = 0; x < this.position.length - 2; x++) {
            if (this.position[x] === 0) return true;
        }
        return false;
    }

    getHash(): string {
        return this.position.join(',');
    }

    getReflectedHash(): string {
        return this.position.map((v, dim) => {
            if (dim < (this.position.length-2)) {
                return Math.abs(v);
            }
            return v;
        }).join(',');
    }

    static fromHash(hash: string): Point {
        return new Point(hash.split(',').map(v => parseInt(v, 10)));
    }
}

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    input: Set<Point>
    initialize() {
        this.input = new Set<Point>();
        this.readInput().split('\n').forEach((line, y) => {
            line.split('').forEach((c, x) => {
                if (c === '#') {
                    this.input.add(new Point([y, x]));
                }
            });
        });
        
    }

    executePart1(): string|number {
        const DIMENSIONS = 3;
        const ITERATIONS = 6;

        // extend points into n dimensions
        this.input.forEach(p => {
            p.position = (new Array(DIMENSIONS - 2)).fill(0).concat(p.position);
        });

        let active = new Set<string>();
        this.input.forEach(v => {
            active.add(v.getHash());
        });
        for (let iteration = 0; iteration < ITERATIONS; iteration++) {
            let adjacentToActive = new Map<string, number>();
            let newActive = new Set<string>();
            for (let p of active) {
                let pt = Point.fromHash(p);
                let neighbors = pt.generateNeighbors();
                for (let n of neighbors) {
                    if (!n.isBelowPlane()) {
                        let hash = n.getHash();
                        let inc = 1;
                        if (n.isOnPlane()) inc = pt.getNumberOfReflections();
                        adjacentToActive.set(hash, (adjacentToActive.get(hash)||0) + inc);
                    }
                }
            }
            adjacentToActive.forEach((count, candidate) => {
                if (active.has(candidate)) {
                    if (count === 2 || count == 3) newActive.add(candidate);
                } else {
                    if (count === 3) newActive.add(candidate);
                }
            });
            active = newActive;
        }

        let count = 0;
        active.forEach(hash => {
            let p = Point.fromHash(hash);
            count += p.getNumberOfReflections();
        });

        return count;
    }

    executePart2(): string|number {
        return "";
    }
}
