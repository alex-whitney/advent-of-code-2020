import * as _ from 'lodash';
import * as moment from 'moment';

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
        u.print('Initializing...');
        let start = moment();
        this.initialize();
        u.print(`Completed in ${moment().diff(start)}ms`);

        u.print('\n*** PART 1 ***');
        start = moment();
        let result = this.executePart1();
        u.print(`Completed in ${moment().diff(start)}ms`);
        u.print(`Result: ${result+""}`);

        u.print('\n*** PART 2 ***');
        start = moment();
        result = this.executePart2();
        u.print(`Completed in ${moment().diff(start)}ms`);
        u.print(`Result: ${result+""}`);
    }

}
