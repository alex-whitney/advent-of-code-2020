import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';

// so much easier than yesterday, although the problem was super confusing.

interface Record {
    ingredients: string[]
    allergens: string[]
}
export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    input: Record[]
    allergens: Set<string>
    initialize() {
        this.input = this.readInput().split('\n').map(line => {
            let parts = line.split('(');
            let ing = parts[0].trim().split(' ');
            let all = parts[1].slice(9, parts[1].length - 1).split(',').map(v => v.trim());
            return {
                ingredients: ing,
                allergens: all
            }
        });
        console.log(this.input[0]); 
    }

    executePart1(): string|number {
        let byIngredient = new Map<string, Set<Record>>();
        let byAllergen = new Map<string, Set<Record>>();
        this.input.forEach(rec => {
            rec.ingredients.forEach(ing => {
                if (!byIngredient.has(ing)) byIngredient.set(ing, new Set<Record>());
                byIngredient.get(ing).add(rec);
            });
            rec.allergens.forEach(a => {
                if (!byAllergen.has(a)) byAllergen.set(a, new Set<Record>());
                byAllergen.get(a).add(rec);
            });
        });
        
        // Every time an allergen appears, the corresponding ingredient
        // MUST be in the ingredient list.
        let possibleIngredients = new Map<string, Set<string>>();
        byAllergen.forEach((records, allergen) => {
            let p: Set<string>;
            records.forEach(r => {
                if (!p) {
                    p = new Set<string>(r.ingredients)
                } else {
                    p.forEach(v => {
                        if (r.ingredients.indexOf(v) < 0) {
                            p.delete(v);
                        }
                    });
                }
            });
            possibleIngredients.set(allergen, p);
        });

        // Assume the input is nice and can be solved greedily...
        let allergens = new Map<string, string>();
        while (possibleIngredients.size > 0) {
            let next: string;
            possibleIngredients.forEach((ingredients, allergen) => {
                if (ingredients.size === 1) next = allergen;
                if (ingredients.size === 0) throw 'something broke';
            });
            if (!next) throw 'not solvable this way';
            let ing = [...possibleIngredients.get(next)][0];
            allergens.set(ing, next);
            possibleIngredients.delete(next);
            possibleIngredients.forEach((ingredients, allergen) => {
                ingredients.delete(ing);
            });
        }

        let count = 0;
        byIngredient.forEach((recs, ing) => {
            if (allergens.has(ing)) return;
            count += recs.size;
        });

        /* Part 2 - a freebie */
        let map = [];
        allergens.forEach((allergen, ing) => {
            map.push({
                a: allergen,
                i: ing
            });
        });

        u.print('\n\nPART 2:\n' + _.map(_.sortBy(map, 'a'), 'i').join(','));
        u.print();
        /* end part 2 */

        return count;
    }

    executePart2(): string|number {
        return "";
    }
}
