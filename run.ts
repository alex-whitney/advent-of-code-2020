// ts-node ./run < day >
//   ex: ts-node ./run <path to day directory>

import {Day} from './lib/day';

let dirName = process.argv[2];
let inputFile = process.argv[3];

const DayImpl = require(dirName + '/day').default;
let day: Day = new DayImpl();

if (inputFile) {
    day.InputPath = inputFile;
}

day.run();
