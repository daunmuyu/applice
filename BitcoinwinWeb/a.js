﻿var readlineSync = require("readline-sync");
var userName = readlineSync.question('May I have your name? ');
console.log('Hi ' + userName + '!');

