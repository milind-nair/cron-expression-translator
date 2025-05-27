import { dayMap, monthMap } from "../constants.js";
import { getFullDayName, getNumberSuffix, offsetToText } from "./formatters.js";

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
    if (range !== "*" && range.includes("-")) {
      const [startRange, endRange] = range.split("-");
      result += `, on day ${startRange} through ${endRange}`;
    }
    result += ` of the month`;
  } else if (fieldName === "month") {
    result = `Every ${stepNum} months`;
    if (range !== "*" && range.includes("-")) {
      const [startRange, endRange] = range.split("-");
      result += `, only in ${monthMap[parseInt(startRange) - 1]} through ${
        monthMap[parseInt(endRange) - 1]
      }`;
    }
  } else if (fieldName === "day of the week") {
    result = `every ${stepNum}${getNumberSuffix(stepNum)} day of the week`;
    if (range !== "*" && range.includes("-")) {
      const [startRange, endRange] = range.split("-");
      result += `, ${dayMap[parseInt(startRange)]} through ${
        dayMap[parseInt(endRange)]
      }`;
    }
  } else {
    result = `Every ${stepNum} ${fieldName}s`;
    if (range !== "*" && range.includes("-")) {
      const [startRange, endRange] = range.split("-");
      result += ` from the ${startRange}${getNumberSuffix(
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
  return `at ${numValue}${getNumberSuffix(numValue)} ${fieldName}`;
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

  let prefix = "";
  if (fieldName === "day of the month") {
    prefix = "on ";
  } else if (fieldName === "month") {
    prefix = "only in ";
  } else if (fieldName === "day of the week") {
    prefix = "only on ";
  } else {
    prefix = "at ";
  }

  let result = prefix;
  if (values.length > 1) {
    result += values.slice(0, -1).join(", ") + " and " + values.slice(-1);
  } else {
    result += values[0];
  }

  if (
    (fieldName === "minute" || fieldName === "hour" || fieldName === "second") &&
    values.length === 1 &&
    !result.toLowerCase().includes(fieldName)
  ) {
    result += ` ${fieldName}`;
  } else if (
    (fieldName === "minute" || fieldName === "hour" || fieldName === "second") &&
    values.length > 1 &&
    !result.toLowerCase().includes(fieldName + "s")
  ) {
     result += ` ${fieldName}s`;
  }
  return result;
}

export function handleWeekSpecials(dayOfWeekValue) {
  if (dayOfWeekValue.includes("#")) {
    const parts = dayOfWeekValue.split("#");
    if (parts.length === 2) {
        const dayNum = parts[0];
        const occurrence = parts[1];
        const dayName = dayMap[parseInt(dayNum)] || getFullDayName(dayNum);
        if (dayName && !isNaN(parseInt(occurrence))) {
             return `the ${occurrence}${getNumberSuffix(parseInt(occurrence))} ${dayName} in the month`;
        }
    }
  }
  if (dayOfWeekValue.includes("L")) {
    if (dayOfWeekValue.length === 1 && dayOfWeekValue === "L") {
      return "last day of the week of the month";
    } else if (dayOfWeekValue.endsWith("L") && dayOfWeekValue.length > 1) {
        const dayPart = dayOfWeekValue.substring(0, dayOfWeekValue.length - 1);
        if (!isNaN(parseInt(dayPart))) {
            const day = dayMap[parseInt(dayPart)];
            if (day) return `last ${day} of the month`;
        } else {
            const day = getFullDayName(dayPart);
            if (day && day !== "Invalid day abbreviation") return `last ${day} of the month`;
        }
    }
  }
  return null;
}

export function handleDayOfMonthSpecials(dayOfMonthValue) {
  if (dayOfMonthValue === "L") {
    return "last day of the month";
  } else if (dayOfMonthValue.startsWith("L-")) {
    const offsetValStr = dayOfMonthValue.substring(2);
    const offsetVal = parseInt(offsetValStr);
    if (!isNaN(offsetVal) && offsetVal > 0) {
        const offset = offsetToText(offsetVal);
        return `${offset} day of the month`;
    }
  } else if (dayOfMonthValue === "LW") {
    return "last weekday of the month";
  } else if (dayOfMonthValue.endsWith("W") && dayOfMonthValue.length > 1 && !dayOfMonthValue.startsWith("L")) {
    const dayPart = dayOfMonthValue.substring(0, dayOfMonthValue.length - 1);
    let weekday = parseInt(dayPart);
    if (!isNaN(weekday) && weekday >= 1 && weekday <= 31) {
        return `the nearest weekday to the ${weekday}${getNumberSuffix(weekday)} day of the month`;
    }
  }
  return null;
}