import debugLib from 'debug';
const debug = debugLib('rg_bot:dependency-report:log');

import { generateDependencyReport } from '@discordjs/voice';

console.log(generateDependencyReport());
