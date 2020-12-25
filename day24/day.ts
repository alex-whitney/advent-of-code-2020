import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';

// Super simple....
// Just remapped the hex grid into coordinates. Every other row is offset by .5 on the x-axis
// This was nearly identical to day 17, but being in 2 dimensions made it substantially simpler

const DIRECTIONS = {
    0: 'e',
    1: 'se',
    2: 'sw',
    3: 'w',
    4: 'nw',
    5: 'ne'
}

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }
    
    rawInput: string[]
    instructions: number[][]
    initialize() {
        this.rawInput = this.readInput().split('\n');
        this.instructions = this.rawInput.map(line => {
            line = u.strReplAll(line, 'se', '1');
            line = u.strReplAll(line, 'sw', '2');
            line = u.strReplAll(line, 'nw', '4');
            line = u.strReplAll(line, 'ne', '5');
            line = u.strReplAll(line, 'e', '0');
            line = u.strReplAll(line, 'w', '3');
            return line.split('').map(v => parseInt(v, 10));
        });
    }

    move(direction: number, x: number, y: number): [number, number] {
        switch(direction) {
            case 0:
                x += 1;
                break;
            case 1:
                x += .5;
                y -= 1;
                break;
            case 2:
                x -= .5;
                y -= 1;
                break;
            case 3:
                x -= 1;
                break;
            case 4:
                x -= .5;
                y += 1;
                break;
            case 5:
                x += .5;
                y += 1;
                break;
            default:
                throw 'invalid';
        }
        return [x, y];
    }

    initialFloor(): Set<string> {
        let points = this.instructions.map(instr => {
            let pt = [0, 0];
            instr.forEach(i => {
                pt = this.move(i, pt[0], pt[1]);
            });
            return pt.join(',');
        });
        let count = new Map<string, number>();
        points.forEach(pt => {
            count.set(pt, (count.get(pt)||0) + 1);
        });
        let blackTiles = new Set<string>();
        count.forEach((c, pt) => {
            if (c % 2 === 1) blackTiles.add(pt);
        });
        return blackTiles;
    }

    generateNeighbors(coord: string): string[] {
        let [x, y] = coord.split(',').map(v => parseFloat(v));
        let ret = [];
        _.keys(DIRECTIONS).forEach((d) => {
            ret.push(this.move(parseInt(d, 10), x, y).join(','));
        });
        return ret;
    }

    flipTiles(blackTiles: Set<string>): Set<string> {
        let newBlackTiles = new Set<string>();

        let adjToBlack = new Map<string, number>();
        blackTiles.forEach(t => {
            this.generateNeighbors(t).forEach(c => {
                adjToBlack.set(c, (adjToBlack.get(c)||0) + 1);
            });
        });

        adjToBlack.forEach((ct, t) => {
            if (blackTiles.has(t)) {
                if (ct === 1 || ct === 2) {
                    newBlackTiles.add(t);
                }
            } else {
                if (ct === 2) {
                    newBlackTiles.add(t);
                }
            }
        });

        return newBlackTiles;
    }

    executePart1(): string|number {
        let blackTiles = this.initialFloor();
        return blackTiles.size;
    }

    executePart2(): string|number {
        let tiles = this.initialFloor();
        for (let i = 0; i < 100; i++) {
            tiles = this.flipTiles(tiles);
            u.print(`day ${i+1}: ${tiles.size}`)
        }
        return tiles.size;
    }
}
