import {readFileSync} from 'fs';

interface InputRow {
    raw: string
    letter: string
    min: number
    max: number
    password: string
}

function getInput(): InputRow[] {
    let contents = readFileSync(__dirname + "/input.txt");
    let arr: string[] = contents.toString().split('\n');

    let lineRe = /^(\d+)-(\d+) (\w): (.*)$/;
    return arr.map(v => {      
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


function main() {
    let list = getInput();
    
    console.log('** PART 1 **');
    let valid = [];
    list.forEach(rec => {
        let count = rec.password.length;
        let re = new RegExp(rec.letter, "g");
        count = count - rec.password.replace(re, "").length;
        
        if (rec.min <= count && rec.max >= count) {
            valid.push(rec);
        }
    });
    console.log("Number of valid puzzles: " + valid.length);

    console.log();
    console.log('** PART 2 **');
    valid = [];
    list.forEach(rec => {
        let pos1 = rec.password[rec.min - 1] == rec.letter;
        let pos2 = rec.password[rec.max - 1] == rec.letter;

        if ((pos1 || pos2) && !(pos1 && pos2)) {
            valid.push(rec);
        }
    });
    console.log("Number of valid puzzles: " + valid.length);
}

main();
