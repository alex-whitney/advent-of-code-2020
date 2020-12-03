import {Day} from '../lib/day';

export default class DayImpl extends Day {
    map: boolean[][]
    numColumns: number
    numRows: number

    constructor() {
        super(__dirname);
    }

    initialize() {
        let input = this.readInput();
        this.map = [];
        input.toString().split('\n').forEach(line => {
            this.numColumns = line.length;
            let row: boolean[] = [];
            for (let c of line) {
                row.push(c === '#');
            }
            this.numRows = this.map.push(row);
        });
    }

    hasTree(line: number, col: number): boolean {
        col = col % this.numColumns;
        return this.map[line][col];
    }

    findTreees(rowInc: number, colInc: number): number {
        let row = 0;
        let col = 0;
        let treeCount = 0;
        while (row < this.numRows) {
            if (this.hasTree(row, col)) {
                treeCount++;
            }
            row += rowInc;
            col += colInc;
        }
        return treeCount;
    }

    executePart1(): string {
        return this.findTreees(1, 3) + "";
    }

    executePart2(): string {
        let paths = [
            this.findTreees(1, 1),
            this.findTreees(1, 3),
            this.findTreees(1, 5),
            this.findTreees(1, 7),
            this.findTreees(2, 1)
        ];
        return paths.reduce((x, a) => {
            return x * a;
        }, 1) + "";
    }
}
