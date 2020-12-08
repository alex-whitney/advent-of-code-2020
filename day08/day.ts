import * as _ from 'lodash';

import {Day} from '../lib/day';

// "If everything seems under control, you're not going fast enough."
//      - Mario Andretti
//
//  Too slow. Burned a lot of time in p1 because I misread the instructions for executing 
//  a program. I was also confused about some VSCode behavior when printing values from the
//  debugger. Took a couple minutes to think about p2 before realizing that enumerating
//  all possible mutations would be fine since loops aren't allowed and the input list is
//  short
// 
//    p1: 12:03 - rank 3010
//    p2: 24:07 - rank 2242

interface Instruction {
    operation: string
    offset: number
}

interface Result {
    accumulator: number
    lastLine: number
}

export default class DayImpl extends Day {
    instructions: Instruction[]

    constructor() {
        super(__dirname);
    }

    initialize() {
        let input = this.readInput();
        let lines = input.toString().split('\n');
        this.instructions = [];
        lines.forEach(line => {
            let match = line.match(/^(.*) ([+-]\d+)$/)
            this.instructions.push({
                operation: match[1],
                offset: parseInt(match[2], 10)
            });
        });
    }

    executeProgram(program: Instruction[]): Result {
        let accumulator = 0;
        let line = 0;
        let visitedLines = new Set<number>();
        while (!visitedLines.has(line) && line < program.length) {
            visitedLines.add(line);
            let instruction = program[line];
            switch (instruction.operation) {
                case "nop":
                    line++;
                    break;
                case "jmp":
                    line += instruction.offset;
                    break;
                case "acc":
                    line++;
                    accumulator += instruction.offset;
            }
        }

        return {
            accumulator,
            lastLine: line
        };
    }

    executePart1(): string {
        return this.executeProgram(this.instructions).accumulator + "";
    }

    executePart2(): string {
        for (let idx = 0; idx < this.instructions.length; idx++) {
            let instruction = this.instructions[idx];
            let newInstruction: Instruction;
            switch (instruction.operation) {
                case "jmp":
                    newInstruction = _.assign({}, instruction, {
                        operation: "nop"
                    });
                    break;
                case "nop":
                    newInstruction = _.assign({}, instruction, {
                        operation: "jmp"
                    });
                    break;
            }
            if (newInstruction) {
                let mInstr = _.clone(this.instructions);
                mInstr[idx] = newInstruction;
                let result = this.executeProgram(mInstr);
                if (result.lastLine === mInstr.length) {
                    return result.accumulator + "";
                }
            }
        }

        return "Fail";
    }
}
