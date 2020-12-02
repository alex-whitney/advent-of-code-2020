import {readFileSync} from 'fs';

export abstract class Day {
    directory: string;

    constructor(directory: string) {
        this.directory = directory;
    }

    readInput(): Buffer {
        return readFileSync(`${this.directory}/input.txt`);
    }

    abstract initialize(): void;
    abstract executePart1(): string;
    abstract executePart2(): string;

    run() {
        this.initialize();

        console.log('*** PART 1 ***');
        let result = this.executePart1();
        console.log('Result: ' + result);

        console.log();
        console.log('*** PART 2 ***');
        result = this.executePart2();
        console.log('Result: ' + result);
    }
}