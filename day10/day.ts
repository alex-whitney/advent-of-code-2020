import * as _ from 'lodash';

import {Day} from '../lib/day';

//
// Took me a while to get going because I wasn't really sure how I wanted to tackle
// this problem. Eventually I decided to just start writing code and ended up writing
// a BFS. This got me past the two examples, but did not seem like it would complete
// when running against the main input. Making sure paths walked were valid fixed the
// problem though - but clearly I was slower than many!
// 
// I feel great about how quickly I solved p2! Accidentally copy+pasted the wrong value,
// which added a minute.
//
//    p1: 15:25 - rank 4469
//    p2: 24:41 - rank 1054


export default class DayImpl extends Day {   
    constructor() {
        super(__dirname);
    }

    input: Set<number>
    initialize() {
        let input = this.readInput();
        this.input = new Set(input.split('\n').map(v => {
            return parseInt(v, 10);
        }));
        this.print(this.input[0]);
        this.print(this.input[1]);
    }

    find(): number[] {
        let target = _.max([...this.input]) + 3;
        let paths = [[target]];
        while (paths.length > 0) {
            let path = paths.pop();
            if (path.length === this.input.size + 1) return path;
            let last = _.last(path);
            let left = _.max(_.difference([...this.input], path))
            if (last < left) {
                continue;
            }            
            // next is last -1, -2, -3
            if (this.input.has(last-1)) {
                paths.push([].concat(path, last-1))
            }
            if (this.input.has(last-2)) {
                paths.push([].concat(path, last-2))
            }
            if (this.input.has(last-3)) {
                paths.push([].concat(path, last-3))
            }
        }
        throw 'fail';
    }

    executePart1(): string|number {
        let result = this.find();
        this.print(result);
        let distr = {
            1: 1,
            2: 0,
            3: 0
        }
        for (let i = 1; i < result.length; i++) {
            distr[result[i-1] - result[i]] += 1;
        };
        this.print(distr)

        return distr[1] * distr[3];
    }

    executePart2(): string|number {
        let target = _.max([...this.input]) + 3;
        let counts = {0: 1};
        let arr = [...this.input].sort((a,b)=>a-b);
        for (let val of arr) {
            counts[val] = (counts[val-1]||0) + (counts[val-2]||0) + (counts[val-3]||0);
        }
        this.print(counts);
        return (counts[target-1]||0) + (counts[target-2]||0) + (counts[target-3]||0)
    }
}
