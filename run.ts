// ts-node ./run < day >
//   ex: ts-node ./run day01

import {Day} from './lib/day';

let dayName = process.argv[2];

const DayImpl = require('./' + dayName + '/day').default;
let day: Day = new DayImpl();

day.run();
