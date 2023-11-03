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
    if (i === 5) {
      fieldName.push(handleWeek(field));
    } else if (i === 3) {
      fieldName.push(handleDayOfMonth(field));
    } else {
      if (field === "*" || field === "?") {
        handleAsterisk(fieldName);
      } else if (field.includes("/")) {
        handleStep(field, fieldName);
      } else if (field.includes("-")) {
        handleRange(field, fieldName);
      } else if (field.includes(",")) {
        handleComma(field, fieldName);
      } else {
        handleNumeric(field, fieldName);
        if (parseInt(field) === 0) exclude = true;
      }
    }

    if (!exclude) {
      fieldName[0] = fieldName.slice(1).join(" ");
      cronFieldDescriptions.push(fieldName[0]);
    }
  }

  const description = cronFieldDescriptions.join(", ");

  return description;
};

// TODO : Extract each parameter call to a separate function
// 1) MON-FRI or 3-5 in Day of Week Function

// TODO : When both day of week and day of month parameters are present , give precedence to day of month (Eg :  On 25th December only if its a Friday)
export default translateSpringCronExpression;
