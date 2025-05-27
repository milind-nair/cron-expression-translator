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
  const [
    seconds,
    minutes,
    hours,
    dayOfMonth,
    month,
    dayOfWeek,
    year,
  ] = cronFieldValues;

  let description = "";

  // Handle Seconds, Minutes, and Hours
  const timeParts = [];
  if (seconds !== "0") {
    timeParts.push(handleSeconds(seconds, cronFieldNames[0]));
  }
  if (minutes !== "0") {
    timeParts.push(handleMinutes(minutes, cronFieldNames[1]));
  }
  if (hours !== "0") {
    timeParts.push(handleHours(hours, cronFieldNames[2]));
  }

  if (timeParts.length > 0) {
    description += "At ";
    if (hours !== "*" && hours !== "?") {
      const hourNum = parseInt(hours);
      const ampm = hourNum >= 12 ? "PM" : "AM";
      const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
      description += `${formattedHour.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')} ${ampm}`;
    } else {
      description += timeParts.filter(Boolean).join(", ");
    }
  } else {
    description += "At 00:00:00 AM";
  }

  // Handle Day of Month and Day of Week precedence
  if (dayOfMonth !== "?" && dayOfWeek !== "?") {
    const dayOfMonthDesc = handleDayOfMonth(dayOfMonth, cronFieldNames[3]);
    const dayOfWeekDesc = handleWeek(dayOfWeek);
    if (dayOfMonthDesc && dayOfWeekDesc) {
      description += `, ${dayOfMonthDesc} only if it's a ${dayOfWeekDesc.replace("On ", "")}`;
    }
  } else {
    if (dayOfMonth !== "?") {
      const dayOfMonthDesc = handleDayOfMonth(dayOfMonth, cronFieldNames[3]);
      if (dayOfMonthDesc) {
        description += `, ${dayOfMonthDesc}`;
      }
    } else if (dayOfMonth === "?") {
      description += `, Every day of the month`;
    }
    if (dayOfWeek !== "?") {
      const dayOfWeekDesc = handleDayOfWeek(dayOfWeek, cronFieldNames[5]);
      if (dayOfWeekDesc) {
        description += `, ${dayOfWeekDesc}`;
      }
    } else if (dayOfWeek === "?") {
      description += `, Every day of the week`;
    }
  }

  // Handle Month
  if (month !== "?") {
    const monthDesc = handleMonth(month, cronFieldNames[4]);
    if (monthDesc) {
      description += `, ${monthDesc}`;
    }
  } else {
    description += `, Every month`;
  }

  // Handle Year (if present)
  if (year && year !== "?" && year !== "*") {
    description += `, ${handleNumeric(year, cronFieldNames[6])}`;
  }

  return description.trim();
};

export default translateSpringCronExpression;
