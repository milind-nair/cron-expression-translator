import { dayMap, monthMap, cronFieldNames } from "./constants.js";

export function getFullDayName(shortDay) {
  shortDay = shortDay.toLowerCase();
  for (let i = 0; i < dayMap.length; i++) {
    if (dayMap[i].toLowerCase().startsWith(shortDay)) {
      return dayMap[i];
    }
  }
  return "Invalid day abbreviation";
}

export function getNumberSuffix(number) {
  if (typeof number !== "number" || isNaN(number)) {
    return "Invalid input";
  }

  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return "th";
  }

  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function handleAsterisk(fieldName) {
  return `Every ${fieldName}`;
}

export function handleRange(rangeStr, fieldName) {
  const [start, end] = rangeStr.split("-");
  const startVal = parseInt(start);
  const endVal = parseInt(end);

  if (fieldName === "day of the week") {
    return `${dayMap[startVal]} through ${dayMap[endVal]}`;
  } else if (fieldName === "day of the month") {
    return `on day ${startVal} through ${endVal}`;
  }
  return `From the ${start}${getNumberSuffix(
    startVal
  )} to ${end}${getNumberSuffix(endVal)} ${fieldName}`;
}

export function handleStep(fieldValue, fieldName) {
  const [range, step] = fieldValue.split("/");
  const stepNum = parseInt(step);
  let result = "";

  if (fieldName === "day of the month") {
    result = `every ${stepNum}${getNumberSuffix(stepNum)} day`;
    if (range.includes("-")) {
      const [startRange, endRange] = range.split("-");
      result += `, on day ${startRange} through ${endRange}`;
    }
    result += ` of the month`;
  } else if (fieldName === "month") {
    result = `Every ${stepNum} months`;
    if (range.includes("-")) {
      const [startRange, endRange] = range.split("-");
      result += `, only in ${monthMap[parseInt(startRange) - 1]} through ${
        monthMap[parseInt(endRange) - 1]
      }`;
    }
  } else if (fieldName === "day of the week") {
    result = `every ${stepNum}${getNumberSuffix(stepNum)} day of the week`;
    if (range.includes("-")) {
      const [startRange, endRange] = range.split("-");
      result += `, ${dayMap[parseInt(startRange)]} through ${
        dayMap[parseInt(endRange)]
      }`;
    }
  } else {
    result = `Every ${stepNum} ${fieldName}s`;
    if (range.includes("-")) {
      const [startRange, endRange] = range.split("-");
      result += `From the ${startRange}${getNumberSuffix(
        parseInt(startRange)
      )} to ${endRange}${getNumberSuffix(parseInt(endRange))} ${fieldName}`;
    }
  }
  return result;
}

export function handleNumeric(fieldValue, fieldName) {
  const numValue = parseInt(fieldValue);
  if (fieldName === "month") {
    return `only in ${monthMap[numValue - 1]}`;
  } else if (fieldName === "day of the week") {
    return `only on ${dayMap[numValue]}`;
  } else if (fieldName === "day of the month") {
    return `on day ${numValue}`;
  }
  return `${numValue}${getNumberSuffix(numValue)} ${fieldName}`;
}

export function handleComma(fieldValue, fieldName) {
  const values = fieldValue.split(",").map((val) => {
    const numVal = parseInt(val);
    if (fieldName === "day of the week") {
      return dayMap[numVal];
    } else if (fieldName === "day of the month") {
      return `day ${numVal}`;
    } else if (fieldName === "month") {
      return monthMap[numVal - 1];
    }
    return `${numVal}${getNumberSuffix(numVal)}`;
  });

  let result = "";
  if (fieldName === "day of the month") {
    result = "on ";
  } else if (fieldName === "month") {
    result = "only in ";
  } else if (fieldName === "day of the week") {
    result = "only on ";
  } else {
    result = "At ";
  }

  if (values.length > 1) {
    result += values.slice(0, -1).join(", ") + " and " + values.slice(-1);
  } else {
    result += values[0];
  }

  if (
    (fieldName === "minute" || fieldName === "hour" || fieldName === "second") &&
    values.length === 1
  ) {
    result += ` ${fieldName}`;
  } else if (
    fieldName !== "day of the month" &&
    fieldName !== "month" &&
    fieldName !== "day of the week"
  ) {
    result += ` ${fieldName}s`;
  }
  return result;
}

export function handleWeek(dayOfWeek) {
  if (dayOfWeek === "*" || dayOfWeek === "?") {
    return `Every day of the week`;
  }

  if (dayOfWeek.includes("#")) {
    const [dayNum, occurrence] = dayOfWeek.split("#");
    const dayName = dayMap[parseInt(dayNum)] || getFullDayName(dayNum);
    return `the ${occurrence}${getNumberSuffix(parseInt(occurrence))} ${dayName} in the month`;
  }

  if (dayOfWeek.includes("L")) {
    if (dayOfWeek.length === 1) { // "L"
      return "last day of the week of the month";
    } else if (dayOfWeek.length === 2) { // e.g., "5L"
      const day = dayMap[parseInt(dayOfWeek.substring(0, 1))];
      return `last ${day} of the month`;
    } else { // e.g., "THUL"
      const day = getFullDayName(dayOfWeek.substring(0, dayOfWeek.length - 1));
      return `last ${day} of the month`;
    }
  }

  // For simple numeric or named days (e.g., "1", "MON")
  return `On ${dayMap[parseInt(dayOfWeek)] || getFullDayName(dayOfWeek)}`;
}

function offsetToText(offset) {
  if (offset === 1) return "last";
  if (offset === 2) return "second-to-last";
  if (offset === 3) return "third-to-last";
  if (offset > 3) return `${offset}${getNumberSuffix(offset)}-to-last`;
  return offset;
}

export function handleDayOfMonth(dayOfMonth) {
  if (dayOfMonth === "*" || dayOfMonth === "?") return "Every day of the month";
  if (dayOfMonth === "L") {
    return "last day of the month";
  } else if (dayOfMonth.startsWith("L-")) {
    const offset = offsetToText(parseInt(dayOfMonth.substring(2)));
    return `${offset} day of the month`;
  } else if (dayOfMonth === "LW") {
    return "last weekday of the month";
  } else if (dayOfMonth.includes("W")) {
    let weekday = parseInt(dayOfMonth.substring(0, dayOfMonth.length - 1));
    return `the nearest weekday to the ${weekday}${getNumberSuffix(
      weekday
    )} day of the month`;
  } else {
    return `on day ${parseInt(dayOfMonth)}`;
  }
}

export function handleSeconds(fieldValue, fieldName) {
  if (fieldValue === "0") return null;
  if (fieldValue === "*" || fieldValue === "?") {
    return handleAsterisk(fieldName);
  } else if (fieldValue.includes("/")) {
    return handleStep(fieldValue, fieldName);
  } else if (fieldValue.includes("-")) {
    return handleRange(fieldValue, fieldName);
  } else if (fieldValue.includes(",")) {
    return handleComma(fieldValue, fieldName);
  } else {
    return handleNumeric(fieldValue, fieldName);
  }
}

export function handleMinutes(fieldValue, fieldName) {
  if (fieldValue === "0") return null;
  if (fieldValue === "*" || fieldValue === "?") {
    return handleAsterisk(fieldName);
  } else if (fieldValue.includes("/")) {
    return handleStep(fieldValue, fieldName);
  } else if (fieldValue.includes("-")) {
    return handleRange(fieldValue, fieldName);
  } else if (fieldValue.includes(",")) {
    return handleComma(fieldValue, fieldName);
  } else {
    return handleNumeric(fieldValue, fieldName);
  }
}

export function handleHours(fieldValue, fieldName) {
  if (fieldValue === "0") return null;
  if (fieldValue === "*" || fieldValue === "?") {
    return handleAsterisk(fieldName);
  } else if (fieldValue.includes("/")) {
    return handleStep(fieldValue, fieldName);
  } else if (fieldValue.includes("-")) {
    return handleRange(fieldValue, fieldName);
  } else if (fieldValue.includes(",")) {
    return handleComma(fieldValue, fieldName);
  } else {
    return handleNumeric(fieldValue, fieldName);
  }
}

export function handleDayOfMonthField(fieldValue, fieldName) {
  if (fieldValue === "*" || fieldValue === "?") {
    return handleAsterisk(fieldName);
  } else if (fieldValue.includes("/")) {
    return handleStep(fieldValue, fieldName);
  } else if (fieldValue.includes("-")) {
    return handleRange(fieldValue, fieldName);
  } else if (fieldValue.includes(",")) {
    return handleComma(fieldValue, fieldName);
  } else {
    return handleNumeric(fieldValue, fieldName);
  }
}

export function handleMonth(fieldValue, fieldName) {
  if (fieldValue === "*" || fieldValue === "?") {
    return handleAsterisk(fieldName);
  } else if (fieldValue.includes("/")) {
    return handleStep(fieldValue, fieldName);
  } else if (fieldValue.includes("-")) {
    return handleRange(fieldValue, fieldName);
  } else if (fieldValue.includes(",")) {
    return handleComma(fieldValue, fieldName);
  } else {
    return handleNumeric(fieldValue, fieldName);
  }
}

export function handleDayOfWeek(fieldValue, fieldName) {
  if (fieldValue.includes("#") || fieldValue.includes("L")) {
    return handleWeek(fieldValue);
  } else if (fieldValue === "*" || fieldValue === "?") {
    return handleAsterisk(fieldName);
  } else if (fieldValue.includes("/")) {
    return handleStep(fieldValue, fieldName);
  } else if (fieldValue.includes("-")) {
    return handleRange(fieldValue, fieldName);
  } else if (fieldValue.includes(",")) {
    return handleComma(fieldValue, fieldName);
  } else {
    return handleNumeric(fieldValue, fieldName);
  }
}
