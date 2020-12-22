import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';

interface RCombatResult {
    winner: number
    decks: number[][]
    terminate?: boolean
}

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    decks: number[][]
    initialize() {
        this.decks = this.readInput().split('\n\n').map(deck => 
            deck.split('\n').slice(1).map(v => parseInt(v, 10))
        );
    }

    win(decks: number[][], winner: number) {
        let i = decks[0].shift();
        let j = decks[1].shift();
        if (winner === 0) {
            decks[0].push(i);
            decks[0].push(j);
        } else {
            decks[1].push(j);
            decks[1].push(i);
        }
    }

    executePart1(): string|number {
        let decks = _.cloneDeep(this.decks);
        while (decks[0].length !== 0 && decks[1].length !== 0) {
            if (decks[0][0] > decks[1][0]) {
                this.win(decks, 0);
            } else {
                this.win(decks, 1);
            }
        }
        let count = 0;
        let d = decks[0].length === 0 ? decks[1] : decks[0];
        for (let i = 0; i < d.length; i++) {
            count += d[i] * (d.length - i);
        }
        return count;
    }

    recursiveCombatRound(decks: number[][], previousRoundConf: Set<string>): RCombatResult {
        let hash = decks[0].join(',') + '-' + decks[1].join(',');
        if (previousRoundConf.has(hash)) return { terminate: true, winner: 0, decks: decks };
        previousRoundConf.add(hash);

        if (decks[0][0] < decks[0].length && decks[1][0] < decks[1].length) {
            let deckClone = _.cloneDeep(decks);
            let i = deckClone[0].shift();
            deckClone[0] = deckClone[0].slice(0, i);
            let j = deckClone[1].shift();
            deckClone[1] = deckClone[1].slice(0, j);
            let res = this.recursiveCombatGame(deckClone);
            this.win(decks, res.winner);
            return {
                decks: decks,
                winner: res.winner
            };
        }

        decks = _.cloneDeep(decks);
        let result = {
            winner: 0,
            decks: decks
        };
        if (decks[0][0] < decks[1][0]) {
            result.winner = 1;
        }
        this.win(decks, result.winner);
        return result;
    }

    recursiveCombatGame(decks: number[][]): RCombatResult {
        let previousRoundConf = new Set<string>();
        decks = _.cloneDeep(decks);
        let end = false;
        let winner = 0;
        while (!end) {
            let result = this.recursiveCombatRound(decks, previousRoundConf);
            decks = result.decks;
            end = result.terminate;
            if (decks[0].length === 0) {
                end = true;
                winner = 1;
            } else if (decks[1].length === 0) {
                end = true;
                winner = 0;
            }
        }
        return {
            decks,
            winner
        };
    }

    executePart2(): string|number {
        let result = this.recursiveCombatGame(this.decks);
        let count = 0;
        let d = result.decks[result.winner];
        for (let i = 0; i < d.length; i++) {
            count += d[i] * (d.length - i);
        }
        return count;
    }
}
