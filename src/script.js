import { cronFieldNames } from "./constants.js";
import {
  handleAsterisk,
  handleComma,
  handleDayOfMonth,
  handleNumeric,
  handleRange,
  handleStep,
  handleWeek,
} from "./utils.js";

const translateSpringCronExpression = (expression) => {
  const cronFieldDescriptions = [];
  const cronFields = expression.split(" ");
  for (let i = 0; i < 6; i++) {
    let exclude = false;
    const field = cronFields[i];
    const fieldName = [cronFieldNames[i]];
    let cronFieldDescription = "";
    if (i === 5) {
      cronFieldDescription += handleWeek(field);
    } else if (i === 3) {
      cronFieldDescription += handleDayOfMonth(field);
    } else {
      if (field === "*" || field === "?") {
        cronFieldDescription += handleAsterisk(fieldName);
      } else if (field.includes("/")) {
        cronFieldDescription += handleStep(field, fieldName);
      } else if (field.includes("-")) {
        cronFieldDescription += handleRange(field, fieldName);
      } else if (field.includes(",")) {
        cronFieldDescription += handleComma(field, fieldName);
      } else {
        cronFieldDescription += handleNumeric(field, fieldName);
        if (parseInt(field) === 0) exclude = true;
      }
    }
    if (!exclude) {
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
