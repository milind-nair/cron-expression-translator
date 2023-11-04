import { dayMap, monthMap, cronFieldNames } from "./constants.js";

function getFullDayName(shortDay) {
  shortDay = shortDay.toLowerCase();
  for (let i = 0; i < dayMap.length; i++) {
    if (dayMap[i].toLowerCase().startsWith(shortDay)) {
      return dayMap[i];
    }
  }
  return "Invalid day abbreviation";
}

function getNumberSuffix(number) {
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
  return `Every ${fieldName[0]}`;
}

export function handleRange(rangeStr, fieldName) {
  const [start, end] = rangeStr.split("-");
  return `From the ${start}${getNumberSuffix(
    parseInt(start)
  )} to ${end}${getNumberSuffix(parseInt(end))} ${fieldName[0]}`;
}

export function handleStep(field, fieldName) {
  let result = "";
  const [range, step] = field.split("/");
  if (parseInt(step) !== 1) result = `Every ${step} ${fieldName[0]}s`;
  else result = `Every ${fieldName[0]}`;
  if (range.includes("-")) {
    result += handleRange(range, fieldName);
  }
}
export function handleNumeric(field, fieldName) {
  return `${field}${getNumberSuffix(parseInt(field))} ${fieldName[0]}`;
}
export function handleComma(field, fieldName) {
  const values = field.split(",");
  let result = "At";
  result += values.join(" and ") + `${fieldName[0]}s`;
  return result;
}

export function handleWeek(dayOfWeek) {
  let offsetStr = null;
  if (dayOfWeek === "*" || dayOfWeek === "?") return `Any day of the week`;
  if (dayOfWeek.includes("#")) {
    let strArray = dayOfWeek.split("#");
    let offsetNum = parseInt(strArray[1]);
    offsetStr = `the ${offsetNum}${getNumberSuffix(offsetNum)}`;
    dayOfWeek = strArray[0];
  }
  let dayOfWeekText = "";
  if (dayOfWeek.length <= 2) {
    if (dayOfWeek.includes("L")) {
      const day = dayMap[parseInt(dayOfWeek.substring(0, 1))];
      dayOfWeekText = `the last ${day} of the month`;
    } else {
      dayOfWeekText = `On ${offsetStr ? offsetStr : ""} ${
        dayMap[parseInt(dayOfWeek)]
      }`;
    }
  } else if (dayOfWeek.length > 2) {
    if (dayOfWeek.includes("L")) {
      const day = getFullDayName(dayOfWeek.substring(0, 2));
      dayOfWeekText = `the last ${day} of the month`;
    } else {
      dayOfWeekText = `On ${offsetStr ? offsetStr : ""} ${getFullDayName(
        dayOfWeek
      )}`;
    }
  }
  return dayOfWeekText;
}

function offsetToText(offset) {
  if (offset === 1 || offset === -1) return "the last";
  if (offset > 1) return `the ${offset}${getNumberSuffix(offset)}-to-last`;
  return offset;
}

export function handleDayOfMonth(dayOfMonth) {
  let dayOfMonthText = "";
  if (dayOfMonth === "*" || dayOfMonth === "?") return "Every day of the Month";
  if (dayOfMonth === "L") {
    dayOfMonthText = "the last day of the month";
  } else if (dayOfMonth.startsWith("L-")) {
    const offset = offsetToText(parseInt(dayOfMonth.substring(2)));
    dayOfMonthText = `${offset} day of the month from the end`;
  } else if (dayOfMonth === "LW") {
    dayOfMonthText = "the last weekday of the month";
  } else if (dayOfMonth.includes("W")) {
    let weekday = parseInt(dayOfMonth.substring(0, 1));

    dayOfMonthText = `the nearest weekday to the ${weekday}${getNumberSuffix(
      weekday
    )} day of the month`;
  } else {
    dayOfMonthText = `In ${monthMap[parseInt(dayOfMonth) - 1]}`;
  }
  return dayOfMonthText;
}

export function handleSeconds(field, fieldName) {
  let exclude = false;
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
