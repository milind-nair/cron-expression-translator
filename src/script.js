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
  const cronFieldValues = expression.split(" ");
  const handleCronField = (fieldValue, fieldName, index) => {
    
    const handlers = {
      0: () => handleSeconds(fieldValue, fieldName),
      3: () => handleDayOfMonth(fieldValue),
      5: () => handleWeek(fieldValue),
      default: () => {
        if (fieldValue === "*" || fieldValue === "?") {
          return handleAsterisk(fieldName);
        } else if (fieldValue.includes("/")) {
          return handleStep(fieldValue, fieldName); 
        } else if (fieldValue.includes("-")) {
          return handleRange(fieldValue, fieldName);
        } else if (fieldValue.includes(",")) {
          return handleComma(fieldValue, fieldName);
        } else {
          const description = handleNumeric(fieldValue, fieldName);
          return parseInt(fieldValue) === 0 ? null : description;
        }
      }
    };
  
    const handler = handlers[index] || handlers.default;
    return handler();
  };
  
  const cronFieldDescriptions = cronFieldValues
    .map((value, index) => handleCronField(value, cronFieldNames[index], index))
    .filter(description => description !== null);
  const description = cronFieldDescriptions.join(", ");

  return description;
};

// TODO : Extract each parameter call to a separate function
// 1) MON-FRI or 3-5 in Day of Week Function

// TODO : When both day of week and day of month parameters are present , give precedence to day of month (Eg :  On 25th December only if its a Friday)
export default translateSpringCronExpression;
