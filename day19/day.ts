import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';

interface Rule {
    match?: string
    matchRules?: string[][]
}

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    messages: string[]
    rules: Map<string, Rule>
    initialize() {
        let input = this.readInput().split('\n\n');
        this.messages = input[1].split('\n');

        this.rules = new Map<string, Rule>();
        input[0].split('\n').map(line => {
            let [ruleNo, rules] = line.split(':');
            let m = rules.match(/"(.*)"/);
            if (m) {
                this.rules.set(ruleNo, {match: m[1]})
            } else {
                let r = rules.split('|').map(p => {
                    return p.trim().split(' ').map(r => r.trim());
                });
                this.rules.set(ruleNo, { matchRules: r });
            }
        });
    }

    matchPrefix(m: string, ruleN: string): number[] {
        let r = this.rules.get(ruleN);
        if (r.match) {
            if (m.startsWith(r.match)) {
                return [r.match.length];
            }
            return [];
        }

        let matchingLens = new Set<number>();
        for (let sub of r.matchRules) {
            let lastMatchLens = new Set<number>([0]);
            for (let rule of sub) {
                let newLens = new Set<number>();
                for (let last of lastMatchLens) {
                    let matchLens = this.matchPrefix(m.slice(last), rule);
                    for (let len of matchLens) {
                        newLens.add(len+last)
                    }
                }
                lastMatchLens = newLens;
            }
            lastMatchLens.forEach(v => matchingLens.add(v));
        }

        return [...matchingLens];
    }

    executePart1(): string|number {
        let count = 0;
        for (let m of this.messages) {
            let prefixes = this.matchPrefix(m, '0');
            if (_.max(prefixes) === m.length) count++;
        }
        return count;
    }

    executePart2(): string|number {
        this.rules.get('8').matchRules.push(['42', '8']);
        this.rules.get('11').matchRules.push(['42', '11', '31']);

        let count = 0;
        for (let m of this.messages) {
            let prefixes = this.matchPrefix(m, '0');
            if (_.max(prefixes) === m.length) count++;
        }
        return count;
    }
}
