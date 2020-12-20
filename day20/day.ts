import * as _ from 'lodash';
import * as math from 'mathjs';

import * as u from '../lib/util';
import {Day} from '../lib/day';

// The most amount of work to-date! I think this took me around 4h in total.
// It didn't take me too long to get part 1 - after thinking about how to solve
// this problem, I took a guess that the puzzle had "edges" and "corners" that
// couldn't fit anywhere else, and it turned out that was correct. So finding
// the corners was pretty straightforward.
//
// For part 2, putting the image together took quite a bit of work! Most of the
// time was tediously tracking down little errors, though I did end up with 
// a considerable amount of code!
//
// I wasn't going for speed here...I started super late and I took a few breaks,
// but I'm including my stats regardless.
// 
//    p1: 12:02:41 - rank 8697
//    p2: 16:29:47 - rank 5057
//


function rotateSquare(input: string[]): string[] {
    let len = input.length;
    let newVals = new Array<string>(len).fill('');
    for (let r = 0; r < len; r++) {
        for (let c = 0; c < len; c++) {
            newVals[c] += input[r].charAt(c);
        }
    }
    newVals = newVals.map(r => r.split('').reverse().join(''));
    return newVals;
}

function flipSquare(input: string[]): string[] {
    let len = input.length;
    let newVals = new Array<string>(len).fill('');
    for (let r = 0; r < len; r++) {
        for (let c = 0; c < len; c++) {
            newVals[len-r-1] += input[r].charAt(c);
        }
    }
    return newVals;
}

const Sides: Side[] = ['left', 'right', 'bottom', 'top'];
type Side = "left"|"top"|"bottom"|"right"
class Tile {
    id: string
    vals: string[]
    borders: string[]
    flippedBorders: string[]

    constructor(id: string, vals: string[]) {
        this.id = id;
        this.vals = vals;

        this.computeBorders();
    }

    private computeBorders() {
        this.borders = [
            this.getBorder('top'),
            this.getBorder('left'),
            this.getBorder('right'),
            this.getBorder('bottom')
        ];
        this.flippedBorders = this.borders.map(v => v.split('').reverse().join(''));
    }

    rotate() {
        this.vals = rotateSquare(this.vals);
        this.computeBorders();
    }

    flip() {
        this.vals = flipSquare(this.vals);
        this.computeBorders();
    }

    mutateToMatch(matches: [string, Side][]): boolean {
        let check = (): boolean => {
            return _.every(matches.map(([border, side]) => this.getBorder(side) === border))
        }

        for (let s of Sides) {
            if (check()) return true;
            this.rotate();
        }
        this.flip();
        for (let s of Sides) {
            if (check()) return true;
            this.rotate();
        }
        this.flip();
        return false;
    }

    getBorder(side: Side): string {
        switch(side) {
            case "top":
                return this.vals[0];
            case "bottom":
                return _.nth(this.vals, -1);
            case "left":
                return this.vals.map(v => _.nth(v, 0)).join('');
            case "right":
                return this.vals.map(v => _.nth(v, -1)).join('');
            default:
                throw 'bad side';
        }
    }

    clone(): Tile {
        return new Tile(this.id, _.cloneDeep(this.vals));
    }
}

class Picture {
    tiles: Tile[][]

    constructor(tiles: Tile[][]) {
        this.tiles = tiles;
    }

    expand(): Picture {
        let newTiles = _.cloneDeep(this.tiles);
        for (let row of newTiles) {
            row.unshift(null);
            row.push(null);
        }
        let newLen = this.tiles.length + 2;
        newTiles.unshift(new Array<Tile>(newLen));
        newTiles.push(new Array<Tile>(newLen));

        return new Picture(newTiles);
    }

    addBorderTile(t: Tile) {
        let len = this.tiles.length;
        for (let c = 1; c < len-1; c++) {
            if (t.mutateToMatch(this.getPlacementConstraints(0, c))) {
                this.tiles[0][c] = t;
                return;
            }
        }
        for (let c = 1; c < len-1; c++) {
            if (t.mutateToMatch(this.getPlacementConstraints(len-1, c))) {
                this.tiles[len-1][c] = t;
                return;
            }
        }
        for (let r = 1; r < len-1; r++) {
            if (t.mutateToMatch(this.getPlacementConstraints(r, 0))) {
                this.tiles[r][0] = t;
                return;
            }
        }
        for (let r = 1; r < len-1; r++) {
            if (t.mutateToMatch(this.getPlacementConstraints(r, len-1))) {
                this.tiles[r][len-1] = t;
                return;
            }
        }
        throw 'fail';
    }

    addBorderTiles(tiles: Tile[]) {
        let tilesLeft = new Set<Tile>(tiles);
        while (tilesLeft.size > 0) {
            let res = [...tilesLeft].map(t => {
                let pos = this.getPossibleBorderPositions(t);
                return {
                    tile: t,
                    positions: pos
                };
            });
            res = _.sortBy(res, e => e.positions.length);
            this.addBorderTile(res[0].tile);
            tilesLeft.delete(res[0].tile);
        }
    }

    hasTile(r: number, c: number): boolean {
        try {
            return !!this.tiles[r][c];
        } catch {
            return false;
        }
    }

    private getPlacementConstraints(r: number, c: number): [string, Side][] {
        let cond: [string, Side][] = [];
        if (this.hasTile(r+1,c)) cond.push([this.tiles[r+1][c].getBorder('top'), 'bottom'])
        if (this.hasTile(r-1,c)) cond.push([this.tiles[r-1][c].getBorder('bottom'), 'top'])
        if (this.hasTile(r,c-1)) cond.push([this.tiles[r][c-1].getBorder('right'), 'left'])
        if (this.hasTile(r,c+1)) cond.push([this.tiles[r][c+1].getBorder('left'), 'right'])
        return cond;
    }

    getPossibleBorderPositions(tile: Tile): [number, number][] {
        let pos: [number, number][] = [];
        let len = this.tiles.length;
        for (let r = 0; r < len; r++) {
            for (let c = 0; c < len; c++) {
                if (this.tiles[r][c]) continue;
                if ((r===0&&c===0)||(r===len-1&&c===0)||(r===0&&c===len-1)||(r===len-1&&c===len-1)) continue;
                let t = tile.clone();
                if (t.mutateToMatch(this.getPlacementConstraints(r, c))) {
                    pos.push([r, c]);
                }
            }
        }
        return pos;
    }

    addCornerTile(t: Tile) {
        let len = this.tiles.length;
        for (let r of [0, len-1]) {
            for (let c of [0, len-1]) {
                if (this.tiles[r][c]) continue;
                let cond = this.getPlacementConstraints(r, c);

                if (t.mutateToMatch(cond)) {
                    this.tiles[r][c] = t;
                    return;
                }
            }
        }
        throw 'fail';
    }

    toString(): string {
        let lines = new Array<string>(this.tiles.length * 8);
        for (let r = 0; r < this.tiles.length; r++) {
            for (let c = 0; c < this.tiles[r].length; c++) {
                this.tiles[r][c].vals.forEach((line, row) => {
                    if (row > 0 && row < 9) {
                        lines[r*8+row] = (lines[r*8+row]||'') + line.slice(1, line.length - 1);
                    }
                });
            }
        }
        return lines.join('\n');
    }
}

export default class DayImpl extends Day {
    constructor() {
        super(__dirname);
    }

    tiles: Tile[]
    initialize() {
        let s = this.readInput().split('\n\n');
        
        this.tiles = [];
        s.forEach((sec,idx) => {
            let lines = sec.split('\n');
            let tileno = lines[0].match(/Tile (\d+):/)[1];
            
            let arr = lines.splice(1);
            this.tiles.push(new Tile(tileno, arr));
        })
        
        u.print(this.tiles.length + ' tiles');
        u.print(this.tiles[0].getBorder('top'));
        u.print(this.tiles[0].getBorder('right'));
        u.print(this.tiles[0].getBorder('left'));
        u.print(this.tiles[0].getBorder('bottom'));
    }

    // Find tiles with edges that don't match any other edge.
    // only really works if the puzzle maker was nice
    findEdges(tiles: Tile[]): Map<Tile, number> {
        let nomatchCount = new Map<Tile, number>();
        for (let t of tiles) {
            for (let tBorder of Sides) {
                let hasMatch = false;
                let tb = t.getBorder(tBorder);
                for (let o of tiles) {
                    if (t === o) continue;
                    if (o.borders.indexOf(tb) > -1 || o.flippedBorders.indexOf(tb) >-1) {
                        hasMatch = true;
                    }
                }
                if (!hasMatch) {
                    nomatchCount.set(t, (nomatchCount.get(t)||0) + 1);
                }
            }
        }
        return nomatchCount;
    }

    executePart1(): string|number {
        let edgeTiles = this.findEdges(this.tiles);

        let p = 1;
        edgeTiles.forEach((v, tile) => {
            if (v === 2) {
                u.print(tile.id);
                p = p * parseInt(tile.id, 10);
            }
        });

        return p;
    }

    initializePict(corners: Tile[]): Picture {
        let pict = new Picture([[null, null], [null, null]]);
        for (let flip of [0, 1]) {
            for (let rot of Sides) {
                pict.tiles = [[corners[0], null], [null, null]];
                let right = corners[0].getBorder('right');
                let bottom = corners[0].getBorder('bottom');
                let last:Tile = null;
                for (let i = 1; i < corners.length; i++) {
                    if (corners[i].mutateToMatch([[right, 'left']])) {
                        pict.tiles[0][1] = corners[i];
                    } else if (corners[i].mutateToMatch([[bottom, 'top']])) {
                        pict.tiles[1][0] = corners[i];
                    } else {
                        last = corners[i];
                    }
                }
                if (pict.tiles[1][0] && pict.tiles[0][1] && last) {
                    try {
                        pict.addCornerTile(last);
                    } catch {}
                }
                if (pict.tiles[1][0] && pict.tiles[0][1] && pict.tiles[1][1]) {
                    return pict;
                } else {
                    corners[0].rotate();
                }
            }
            corners[0].flip();
        }
        throw 'failed to initialize';
    }

    orientAndFindMonsters(img: string): number {
        let lines = img.split('\n');
        let counts = [];
        for (let side of [0, 1]) {
            for (let orientation of Sides) {
                let monsters = this.findMonsters(img);
                if (monsters > 0) {
                    counts.push(monsters);
                }
                lines = rotateSquare(lines);
                img = lines.join('\n');
            }
            lines = flipSquare(lines);
            img = lines.join('\n');
        }
        return _.max(counts);
    }

    findMonsters(img: string): number {
        let lines = img.split('\n');
        let count = 0;
        for (let r = 1; r < lines.length-1; r++) {
            let body = /^#.{4}##.{4}##.{4}###/;
            for (let c = 0; c < lines.length-20; c++) {
                let bodyM = lines[r].slice(c).match(body);
                if (bodyM) {
                    let isMonster = true;
                    isMonster = isMonster && (lines[r-1].charAt(c + 18) === '#')
                    let m = lines[r+1].slice(c).match(/^.#..#..#..#..#..#/)
                    isMonster = isMonster && !!m;
                    if (isMonster) {
                        count++;
                        c += 20;
                    }
                }
            }
        }

        return count;
    }

    executePart2(): string|number {
        let remaining = this.tiles;
        let edges: Tile[][] = [];
        let corners: Tile[][] = [];
        while (remaining.length > 1) {
            let edgeTiles = this.findEdges(remaining);
            let c = [];
            let e = [];
            edgeTiles.forEach((v, tile) => {
                if (v === 1) {
                    e.push(tile);
                } else if (v === 2) {
                    c.push(tile);
                } else {
                    throw 'something broke';
                }
            });
            edges.push(e);
            corners.push(c);

            remaining = _.filter(remaining, t => {
                return !edgeTiles.has(t);
            });
        }

        let pict: Picture;
        let firstLayer = 0;
        edges = _.reverse(edges);
        corners = _.reverse(corners);
        if (remaining.length === 1) {
            pict = new Picture([remaining]);
        } else {
            firstLayer = 1;
            pict = this.initializePict(corners[0]);
        }
        for (let layer = firstLayer; layer < edges.length; layer++) {
            pict = pict.expand();
            pict.addBorderTiles(edges[layer]);
            corners[layer].forEach(e => {
                pict.addCornerTile(e);
            });
        }

        let raw = pict.toString();
        let totalHash = _.countBy(raw)['#'];
        let count = this.orientAndFindMonsters(raw);
        u.print('Sea monster count: ' + count);

        return totalHash - (count*15);
    }
}
