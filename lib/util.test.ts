import {assert} from 'chai';

import * as u from '../lib/util';

describe('util', () => {
    describe('strReplAll', () => {
        it('should replace all occurrences', () => {
            let tc: [string, string, string, string][] = [
                ["one two three", " ", "x", "onextwoxthree"],
                ["one two three", "t", "", "one wo hree"],
                ["one one three", "one", "1", "1 1 three"],
                ["FOOBARBARFOO", "FOO", "1", '1BARBAR1'],
                ["1BARBAR1", "BAR", "0", '1001']
            ];
            for (let testCase of tc) {
                let result = u.strReplAll(testCase[0], testCase[1], testCase[2]);
                assert.equal(result, testCase[3], JSON.stringify(testCase));
            }
        });
    });

    describe('strToBinary', () => {
        it('should convert', () => {
            let tc: [string, string, string, string][] = [
                ["11001100", "1", "0", '11001100'],
                ["AAAABB", "A", "B", '111100'],
                ["AABAABB", "B", "A", '0010011']
            ];
            for (let testCase of tc) {
                let result = u.strToBinary(testCase[0], testCase[1], testCase[2]);
                assert.equal(result, parseInt(testCase[3], 2), JSON.stringify(testCase));
            }
        });

        it('should error on malformed input', () => {
            let tc: [string, string, string][] = [
                ["1100B1100", "1", "0"],
                ["1AAAABB", "A", "B"],
                ["0AAAABB", "A", "B"],
                ["0xAAAABB", "A", "B"]
            ];
            for (let testCase of tc) {
                let threw = false;
                try {
                    u.strToBinary(testCase[0], testCase[1], testCase[2]);
                } catch {
                    threw = true;
                }
                assert(threw, JSON.stringify(testCase));
            }
        });
    });

    describe('isSuperset', () => {
        it('should compute isSuperset', () => {
            let tc: [any[]|Set<any>, any[]|Set<any>, boolean][] = [
                [[1, 2, 3], [1], true],
                [new Set([1, 2, 3]), new Set([1]), true],
                [[1, 2, 3], [1, 0], false],
                [['a', 'b', 'c'], ['c'], true],
            ];
            for (let testCase of tc) {
                let result = u.isSuperset(testCase[0], testCase[1]);
                assert.equal(result, testCase[2], JSON.stringify(testCase));
            }
        });
    });

    describe('intersection', () => {
        it('should compute intersection', () => {
            let tc: [any[]|Set<any>, any[]|Set<any>, any[]][] = [
                [[1, 2, 3], [1], [1]],
                [new Set([1, 2, 3]), new Set([1]), [1]],
                [[1, 2, 3], [1, 0], [1]],
                [['a', 'b', 'c'], ['c'], ['c']],
                [['a', 'b', 'c'], ['d'], []],
                [['a', 'b', 'c'], ['b', 'c'], ['b', 'c']],
            ];
            for (let testCase of tc) {
                let result = u.intersection(testCase[0], testCase[1]);
                assert.sameMembers([...result], testCase[2], JSON.stringify(testCase));
            }
        });
    });

    describe('difference', () => {
        it('should compute difference', () => {
            let tc: [any[]|Set<any>, any[]|Set<any>, any[]][] = [
                [[1, 2, 3], [1], [2, 3]],
                [new Set([1, 2, 3]), new Set([1]), [2, 3]],
                [[1, 2, 3], [1, 0], [2, 3]],
                [['a', 'b', 'c'], ['c'], ['a', 'b']],
                [['a', 'b', 'c'], ['d'], ['a', 'b', 'c']],
                [['a', 'b', 'c'], ['b', 'c'], ['a']],
            ];
            for (let testCase of tc) {
                let result = u.difference(testCase[0], testCase[1]);
                assert.sameMembers([...result], testCase[2], JSON.stringify(testCase));
            }
        });
    });
});
