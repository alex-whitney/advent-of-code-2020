import * as _ from 'lodash';

import * as u from '../lib/util';
import {Day} from '../lib/day';

// Probably too tired for this tonight, I should have gone to sleep.
// Struggled on this one. Made mistakes on the rotations in p1, and REALLY struggled
// with rotations in p2. Lots of little mistakes, and just generally really slow.
//
//    p1: 18:24 - rank 2484
//    p2: 42:03  - rank 2640

interface Position {
    facing: string,
    posX: number
    posY: number
    wpOffX?: number
    wpOffY?: number
}
interface Instr {
    instr: string
    n: number
}
export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    input: Instr[]
    initialize() {
        this.input = this.readInput().split('\n').map(line => {
            line = line.replace("R270", "L90");
            line = line.replace("L270", "R90");
            let m = line.match(/^(\w)(\d+)$/);
            return {
                instr: m[1],
                n: parseInt(m[2], 10)
            }
        });
        
        u.print(this.input[0]);
        u.print(this.input[1]);
    }

    executePart1(): string|number {
        let pos: Position = {
            facing: "E",
            posX: 0,
            posY: 0
        };
        let dirs = ["N", "W", "S", "E"];

        this.input.forEach(ins => {
            let instr = ins.instr;
            if (instr === "F") {
                instr = pos.facing;
            }
            console.log(ins);
            let i: number;
            switch (instr) {
                case "N":
                    pos.posY += ins.n;
                    break
                case "S":
                    pos.posY -= ins.n;
                    break
                case "W":
                    pos.posX -= ins.n;
                    break
                case "E":
                    pos.posX += ins.n;
                    break
                case "R":
                    i = dirs.indexOf(pos.facing) - (ins.n/90);
                    pos.facing = _(dirs).nth(i);
                    break;
                case "L":
                    i = dirs.indexOf(pos.facing) + (ins.n/90);
                    pos.facing = _(dirs).nth(i%4);
            }
            console.log(pos);
        });

        return Math.abs(pos.posX) + Math.abs(pos.posY);
    }

    executePart2(): string|number {
        let pos: Position = {
            facing: "E",
            posX: 0,
            posY: 0,
            wpOffX: 10,
            wpOffY: 1
        };

        this.input.forEach(ins => {
            let instr = ins.instr;

            switch (instr) {
                case "N":
                    pos.wpOffY += ins.n;
                    break
                case "S":
                    pos.wpOffY -= ins.n;
                    break
                case "W":
                    pos.wpOffX -= ins.n;
                    break
                case "E":
                    pos.wpOffX += ins.n;
                    break
                case "R":
                    if (ins.n === 90) {
                        let oldy = pos.wpOffY
                        pos.wpOffY = -1 * pos.wpOffX;
                        pos.wpOffX = oldy;
                    } else if (ins.n === 180) {
                        pos.wpOffX = -1 * pos.wpOffX;
                        pos.wpOffY = -1 * pos.wpOffY;
                    } else throw new Error(JSON.stringify(ins))

                    break;
                case "L":
                    if (ins.n === 90) {
                        let oldx = pos.wpOffX
                        pos.wpOffX = -1 * pos.wpOffY;
                        pos.wpOffY = oldx;
                    } else if (ins.n === 180) {
                        pos.wpOffX = -1 * pos.wpOffX;
                        pos.wpOffY = -1 * pos.wpOffY;
                    } else throw new Error(JSON.stringify(ins))
                    break   
                case "F":
                    pos.posX += pos.wpOffX * ins.n;
                    pos.posY += pos.wpOffY * ins.n;
            }
            console.log(ins);
            console.log(pos);
        });

        return Math.abs(pos.posX) + Math.abs(pos.posY);
    }
}
