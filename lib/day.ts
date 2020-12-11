import * as _ from 'lodash';

import * as u from './util';
import {readFileSync} from 'fs';

export abstract class Day {
    InputPath: string;

    constructor(directory: string) {
        this.InputPath = `${directory}/input.txt`;
    }

    readInput(): string {
        return readFileSync(this.InputPath).toString();
    }

    abstract initialize(): void;
    abstract executePart1(): string|number;
    abstract executePart2(): string|number;

    run() {
        this.initialize();

        u.print('*** PART 1 ***');
        let result = this.executePart1();
        u.print(`Result: ${result+""}`);

        u.print('\n*** PART 2 ***');
        result = this.executePart2();
        u.print(`Result: ${result+""}`);
    }

}
