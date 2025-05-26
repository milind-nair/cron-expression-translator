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
  handleMinutes,
  handleHours,
  handleDayOfMonthField,
  handleMonth,
  handleDayOfWeek,
} from "./utils.js";

const translateSpringCronExpression = (expression) => {
  const cronFieldValues = expression.split(" ");
  const handleCronField = (fieldValue, fieldName, index) => {
    
    const handlers = {
      0: () => handleSeconds(fieldValue, fieldName),
      1: () => handleMinutes(fieldValue, fieldName),
      2: () => handleHours(fieldValue, fieldName),
      3: () => handleDayOfMonthField(fieldValue, fieldName),
      4: () => handleMonth(fieldValue, fieldName),
      5: () => handleDayOfWeek(fieldValue, fieldName),
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

  let description = cronFieldDescriptions.join(", ");

  // Handle precedence for Day of Month and Day of Week
  const dayOfMonthIndex = 3;
  const dayOfWeekIndex = 5;

  const dayOfMonthValue = cronFieldValues[dayOfMonthIndex];
  const dayOfWeekValue = cronFieldValues[dayOfWeekIndex];

  if (dayOfMonthValue !== "?" && dayOfWeekValue !== "?") {
    const dayOfMonthDesc = handleDayOfMonth(dayOfMonthValue);
    const dayOfWeekDesc = handleWeek(dayOfWeekValue);

    if (dayOfMonthDesc && dayOfWeekDesc) {
      description = `${dayOfMonthDesc} only if it's a ${dayOfWeekDesc.replace("On ", "")}`;
    }
  }

  return description;
};

export default translateSpringCronExpression;
