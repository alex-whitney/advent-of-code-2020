import {Day} from '../lib/day';

interface InputRow {
    raw: string
    letter: string
    min: number
    max: number
    password: string
}

export default class DayImpl extends Day {
    input: InputRow[];

    constructor() {
        super(__dirname);
    }

    initialize() {
        let input = this.readInput();
        let arr: string[] = input.toString().split('\n');
    
        let lineRe = /^(\d+)-(\d+) (\w): (.*)$/;
        this.input = arr.map(v => {      
            let matches = v.match(lineRe);
            if (!matches) {
                throw new Error("Error parsing line: " + v);
            }
    
            return {
                raw: v,
                letter: matches[3],
                min: parseInt(matches[1], 10),
                max: parseInt(matches[2], 10),
                password: matches[4]
            };
        });
    }

    executePart1(): string {
        let validCount = 0;
        this.input.forEach(rec => {
            let count = rec.password.length;
            let re = new RegExp(rec.letter, "g");
            count = count - rec.password.replace(re, "").length;
            
            if (rec.min <= count && rec.max >= count) {
                validCount++;
            }
        });

        return validCount + "";
    }

    executePart2(): string {
        let validCount = 0;
        this.input.forEach(rec => {
            let pos1 = rec.password[rec.min - 1] == rec.letter;
            let pos2 = rec.password[rec.max - 1] == rec.letter;
    
            if ((pos1 || pos2) && !(pos1 && pos2)) {
                validCount++;
            }
        });

        return validCount + "";
    }
}
