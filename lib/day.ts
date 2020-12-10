import * as _ from 'lodash';

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

        this.print('*** PART 1 ***');
        let result = this.executePart1();
        this.print(`Result: ${result+""}`);

        this.print('\n*** PART 2 ***');
        result = this.executePart2();
        this.print(`Result: ${result+""}`);
    }

    /**
     * Because console.log() is too long to type
     */
    protected print(...things: any) {
        console.log.call(console, ...things);
    }

    /**
     * Replaces all occurrences of the target string with the replacement string in str.
     * 
     * Because str.replace(new RegExp(target, 'g'), replacement) is cumbersome and
     * string.prototype.replaceAll is not available yet
     */
    protected sReplAll(str: string, target: string, replacement: string): string {
        return str.replace(new RegExp(target, 'g'), replacement);
    }

    /**
     * Converts a string consisting of two characters/strings into binary
     * @param str the string
     * @param oneValue The character/string representing 1
     * @param zeroValue The character/string representing 0
     */
    protected sToBinary(str: string, oneValue: string, zeroValue: string): number {
        if (_.uniq(str).length > 2) throw new Error(`"${str}" does not appear to be a ${oneValue}${zeroValue} string`);
        str = this.sReplAll(str, oneValue, "1");
        str = this.sReplAll(str, zeroValue, "0");
        return parseInt(str, 2);
    }

    /**
     * Computes whether or not a set is a superset of a given set
     * @param set 
     * @param subset 
     * @returns boolean
     */
    protected isSuperset(set: Set<any>|any[], subset: Set<any>|any[]): boolean {
        if (_.isArray(set)) {
            set = new Set(set);
        }
        if (_.isArray(subset)) {
            subset = new Set(subset);
        }
        for (let e of subset) {
            if (!set.has(e)) return false;
        }
        return true;
    }

    /**
     * Computes the intersection of two sets
     * @param setA 
     * @param setB 
     */
    protected intersection<T>(setA: Set<T>|T[], setB: Set<T>|T[]): Set<T> {
        let _intersection = new Set<T>()
        if (_.isArray(setA)) {
            setA = new Set(setA);
        }
        for (let elem of setB) {
            if (setA.has(elem)) {
                _intersection.add(elem)
            }
        }
        return _intersection;
    }
}
