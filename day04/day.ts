import {Day} from '../lib/day';

// Went for speed today - finished:
//  p1: 6:52 - rank 632
//  p2: 23:57 - rank 697
//
// Made a couple mistakes in part 2 in my haste that added a few minutes

export default class DayImpl extends Day {
    records: any[]

    constructor() {
        super(__dirname);
    }

    initialize() {
        let input = this.readInput();
        this.records = [];
        let rec = {};
        input.toString().split('\n').forEach(line => {
            if (line == "") {
                this.records.push(rec);
                rec = {};
            } else {
                let parts = line.split(' ');
                for (let p of parts) {
                    let p2 = p.split(':');
                    rec[p2[0]] = p2[1];
                }
            }
        });
        this.records.push(rec);
    }

    executePart1(): string {
        let count = 0;
        for (let r of this.records) {
            if (r.byr && r.iyr && r.eyr && r.hgt && r.hcl && r.ecl && r.pid) {
                count++;
            }
        }
        return count + "";
    }

    executePart2(): string {
        let count = 0;
        for (let r of this.records) {
            if (r.byr && r.iyr && r.eyr && r.hgt && r.hcl && r.ecl && r.pid) {
                let parsed = parseInt(r.byr, 10);
                if (parsed < 1920 || parsed > 2002) continue;

                parsed = parseInt(r.iyr, 10);
                if (parsed < 2010 || parsed > 2020) continue;

                parsed = parseInt(r.eyr, 10);
                if (parsed < 2020 || parsed > 2030) continue;

                let match = r.hgt.match(/^(\d+)(cm|in)$/);
                if (!match) continue;
                if (match[2] === 'cm') {
                    parsed = parseInt(match[1], 10);
                    if (parsed < 150 || parsed > 193) continue;
                } else if (match[2] === 'in') {
                    parsed = parseInt(match[1], 10);
                    if (parsed < 59 || parsed > 76) continue;
                } else {
                    continue;
                }

                match = /^#[0-9a-f]{6}$/.test(r.hcl);
                if (!match) continue;

                if (['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(r.ecl) < 0) {
                    continue;
                }

                match = /^[0-9]{9}$/.test(r.pid);
                if (!match) continue;

                count++;
            }
        }

        return count + "";
    }
}
