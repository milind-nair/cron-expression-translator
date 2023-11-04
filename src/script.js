import { cronFieldNames } from "./constants.js";
import {
  handleAsterisk,
  handleComma,
  handleDayOfMonth,
  handleNumeric,
  handleRange,
  handleSeconds,
  handleStep,
  handleWeek,
} from "./utils.js";

const translateSpringCronExpression = (expression) => {
  const cronFieldDescriptions = [];
  const cronFieldValues = expression.split(" ");
  for (let i = 0; i < 6; i++) {
    let exclude = false;
    const fieldValue = cronFieldValues[i];
    const fieldName = cronFieldNames[i];
    let cronFieldDescription = "";
    if (i === 5) {
      cronFieldDescription += handleWeek(fieldValue);
    } else if (i === 3) {
      cronFieldDescription += handleDayOfMonth(fieldValue);
    } else if (i === 0) {
      cronFieldDescription += handleSeconds(fieldValue, fieldName);
    } else {
      if (fieldValue === "*" || fieldValue === "?") {
        cronFieldDescription += handleAsterisk(fieldName);
      } else if (fieldValue.includes("/")) {
        cronFieldDescription += handleStep(fieldValue, fieldName);
      } else if (fieldValue.includes("-")) {
        cronFieldDescription += handleRange(fieldValue, fieldName);
      } else if (fieldValue.includes(",")) {
        cronFieldDescription += handleComma(fieldValue, fieldName);
      } else {
        cronFieldDescription += handleNumeric(fieldValue, fieldName);
        if (parseInt(fieldValue) === 0) exclude = true;
      }
    }
    if (!exclude && cronFieldDescription !== "Ignore") {
      cronFieldDescriptions.push(cronFieldDescription);
    }
  }

  const description = cronFieldDescriptions.join(", ");

  return description;
};

// TODO : Extract each parameter call to a separate function
// 1) MON-FRI or 3-5 in Day of Week Function

// TODO : When both day of week and day of month parameters are present , give precedence to day of month (Eg :  On 25th December only if its a Friday)
export default translateSpringCronExpression;
