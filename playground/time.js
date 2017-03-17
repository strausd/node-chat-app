var moment = require("moment");

// var date = moment();
// date.add(10, 'year').subtract(9, 'months');
// console.log(date.format('MMM Do, YYYY'));

// console.log(date.format('LT'));
var createdAt = 1489750000000;
var someTimestamp = moment().valueOf();
console.log(someTimestamp);
var date = moment(createdAt);
console.log(date.format('h:mm a MM Do YYYY'));