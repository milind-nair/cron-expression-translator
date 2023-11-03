// Example usage:
translateSpringCronExpression = require("./script.js");
// import translateSpringCronExpression from "./script.js";
const cronExpression = "0 0 0 ? * MON#1";
const humanReadable = translateSpringCronExpression(cronExpression);
console.log(humanReadable);
