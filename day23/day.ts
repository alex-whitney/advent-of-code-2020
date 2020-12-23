import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';
import { remove, update } from 'lodash';

// made generic because I like typing
class Node<T> {
    Value: T
    Previous: Node<T>
    Next: Node<T>
    constructor(val: T) {
        this.Value = val;
    }

    setNext(b: Node<T>) {
        this.Next = b;
        b.Previous = this;
    }
}

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    cups: number[]
    min: number
    initialize() {
        this.cups = this.readInput().split('').map(v => parseInt(v, 10));
        this.min = _.min(this.cups);
    }

    executePart1(): string|number {
        let currentCupIndex = 0;
        let cups = _.clone(this.cups);
        for (let i = 0; i < 100; i++) {
            let current = cups[currentCupIndex];
            let destination = cups[currentCupIndex] - 1;

            let pickedUp = [];
            for (let j = 0; j < 3; j++) {
                pickedUp.push(cups[(currentCupIndex+j+1)%cups.length]);
            }
            cups = _.difference(cups, pickedUp);

            while (cups.indexOf(destination) === -1) {
                destination = destination - 1;
                if (destination < this.min) {
                    destination = _.max(cups);
                }
            }
            
            cups.splice(_.indexOf(cups, destination)+1, 0, ...pickedUp);

            currentCupIndex = (_.indexOf(cups, current) +1) % cups.length;
        }

        let result = '';
        for (let i = 0; i < cups.length - 1; i++) {
            result += cups[(i+cups.indexOf(1)+1)%cups.length];
        }

        return result;
    }

    // Reimplemented using a doubly linked list, since the first solution
    // was too computationally expensive. This approach could have been used
    // to solve p1 as well. Since the actual index is unimportant, using a LL
    // avoids the need to rearrange the array, search/index by value, etc.
    executePart2(): string|number {
        let cups = new Map<number, Node<number>>();
        let previous: Node<number>;
        let first: Node<number>;
        let NUM_ITER = 10000000;
        let MAX_N = 1000000;
        for (let i = 0; i < MAX_N; i++) {
            let n = i+1;
            if (i < this.cups.length) {
                n = this.cups[i];
            }
            let node = new Node(n);
            cups.set(n, node);

            if (previous) {
                previous.setNext(node);
            } else {
                first = node;
            }
            previous = node;
        }
        previous.setNext(first);

        let currentNode = first;
        for (let i = 0; i < NUM_ITER; i++) {
            let removed: Node<number>[] = [];
            removed.push(currentNode.Next);
            removed.push(removed[0].Next);
            removed.push(removed[1].Next);
            currentNode.setNext(removed[2].Next);

            let destination = currentNode;
            let removedValues = _.map(removed, r => r.Value);
            do {
                destination = cups.get(destination.Value - 1);
                if (!destination) {
                    destination = cups.get(MAX_N);
                }
            } while (removedValues.indexOf(destination.Value) >= 0)

            let oldNext = destination.Next;
            destination.setNext(removed[0]);
            removed[2].setNext(oldNext);

            currentNode = currentNode.Next;
        }


        let v = []
        let node = cups.get(1).Next;
        for (let i = 0; i < 9; i++) {
            v.push(node.Value);
            node = node.Next;
        }
        u.print(v.join(' '));
        return v[0] * v[1];
    }
}
