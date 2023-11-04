// Example usage:
import translateSpringCronExpression from "./script.js";
const cronExpression = "1 0 0 ? * MON#1";
const humanReadable = translateSpringCronExpression(cronExpression);
console.log(humanReadable);
