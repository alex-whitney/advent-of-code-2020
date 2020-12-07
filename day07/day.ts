import * as _ from 'lodash';

import {Day} from '../lib/day';

const GOLD_BAG = 'shiny gold bags';

export default class DayImpl extends Day {
    bags: Map<String, Map<String, number>>

    constructor() {
        super(__dirname);
        this.bags = new Map<String, Map<string, number>>();
    }

    initialize() {
        let input = this.readInput();
        for (let line of input.toString().split('\n')) {
            let p = line.split('contain');
            let counts = new Map<string, number>();
            for (let inner of p[1].split(',')) {
                let parts = inner.match(/^[ ]?(\d+) (.*?)?[.]?$/);
                if (parts) {
                    let name = parts[2].trim();
                    let count = parseInt(parts[1], 10);
                    if (count == 1) {
                        name = name + 's';
                    }
                    counts.set(name, count);
                }
            }
            this.bags.set(p[0].trim(), counts);
        }
    }

    findParents(color: String): String[] {
        let toRet = [];
        this.bags.forEach((contains, parent) => {
            if (contains.has(color)) {
                toRet.push(parent);
            }
        });
        return toRet;
    }

    executePart1(): string {
        let walks: String[][] = [[GOLD_BAG]]
        let completed: String[][] = [];

        while (walks.length > 0) {
            let path = walks.pop();
            let parents = this.findParents(_.last(path));
            if (parents.length === 0) {
                completed.push(path);
            } else {
                parents.forEach(parent => {
                    walks.push([].concat(path, parent));
                });
            }
        }

        let totalBags = new Set<String>();
        completed.forEach(path => {
            path.forEach(bag => totalBags.add(bag));
        });

        return (totalBags.size - 1) + "";
    }

    executePart2(): string {
        let counts = new Map<String, number>();

        let lookup = (color: String): number => {
            if (!counts.has(color)) {
                let childCount = 0;
                this.bags.get(color).forEach((bagCount, innerColor) => {
                    let innerBagContains = lookup(innerColor);
                    childCount += bagCount*(innerBagContains+1);
                });
                counts.set(color, childCount);
            }
            return counts.get(color);
        }

        return lookup(GOLD_BAG) + "";
    }
}
