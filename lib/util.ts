import * as _ from 'lodash';

/**
 * Because console.log() is too long to type
 */
export function print(...things: any) {
    console.log.call(console, ...things);
}

/**
 * Replaces all occurrences of the target string with the replacement string in str.
 * 
 * Because str.replace(new RegExp(target, 'g'), replacement) is cumbersome and
 * string.prototype.replaceAll is not available yet
 */
export function strReplAll(str: string, target: string, replacement: string): string {
    return str.replace(new RegExp(target, 'g'), replacement);
}

/**
 * Converts a string consisting of two characters/strings into binary
 * @param str the string
 * @param oneValue The character/string representing 1
 * @param zeroValue The character/string representing 0
 */
export function strToBinary(str: string, oneValue: string, zeroValue: string): number {
    str = strReplAll(str, oneValue, "1");
    str = strReplAll(str, zeroValue, "0");
    if (_.uniq(str).length > 2) throw new Error(`"${str}" does not appear to be a ${oneValue}${zeroValue} string`);
    return parseInt(str, 2);
}

/**
 * Computes whether or not a set is a superset of a given set
 * @param set 
 * @param subset 
 * @returns boolean
 */
export function isSuperset(set: Set<any>|any[], subset: Set<any>|any[]): boolean {
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
 * Finds the elements of setA that exist in setB
 * @param setA 
 * @param setB 
 */
export function intersection<T>(setA: Set<T>|T[], setB: Set<T>|T[]): Set<T> {
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

/**
 * Finds the elements of setA that do not exist in setB
 * @param setA 
 * @param setB 
 */
export function difference<T>(setA: Set<T>|T[], setB: Set<T>|T[]): Set<T> {
    let _diff = new Set<T>()
    if (_.isArray(setB)) {
        setB = new Set(setB);
    }
    for (let elem of setA) {
        if (!setB.has(elem)) {
            _diff.add(elem)
        }
    }
    return _diff;
}