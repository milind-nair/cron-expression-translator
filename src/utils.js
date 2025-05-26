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
  return `From the ${start}${getNumberSuffix(
    parseInt(start)
  )} to ${end}${getNumberSuffix(parseInt(end))} ${fieldName}`;
}

export function handleStep(fieldValue, fieldName) {
  let result = "";
  const [range, step] = fieldValue.split("/");
  if (parseInt(step) !== 1) result = `Every ${step} ${fieldName}s`;
  else result = `Every ${fieldName}`;
  if (range.includes("-")) {
    result += handleRange(range, fieldName);
  }
  return result;
}
export function handleNumeric(fieldValue, fieldName) {
  return `${fieldValue}${getNumberSuffix(parseInt(fieldValue))} ${fieldName}`;
}
export function handleComma(fieldValue, fieldName) {
  const values = fieldValue
    .split(",")
    .map((val) => val + getNumberSuffix(parseInt(val)));

  let result = "At ";
  result +=  values.slice(0, -1).join(", ") + " and " + values.slice(-1) + ` ${fieldName}s`
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
      dayOfWeekText = `On ${offsetStr ? offsetStr+" " : ""}${
        dayMap[parseInt(dayOfWeek)]
      }`;
    }
  } else if (dayOfWeek.length > 2) {
    if (dayOfWeek.includes("L")) {
      const day = getFullDayName(dayOfWeek.substring(0, 2));
      dayOfWeekText = `the last ${day} of the month`;
    } else {
      dayOfWeekText = `On ${offsetStr ? offsetStr+" " : ""}${getFullDayName(
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

export function handleSeconds(fieldValue, fieldName) {
  let secondsText = "";
  if (fieldValue === "*" || fieldValue === "?") {
    secondsText = handleAsterisk(fieldName);
  } else if (fieldValue.includes("/")) {
    secondsText = handleStep(fieldValue, fieldName);
  } else if (fieldValue.includes("-")) {
    secondsText = handleRange(fieldValue, fieldName);
  } else if (fieldValue.includes(",")) {
    secondsText = handleComma(fieldValue, fieldName);
  } else {
    if (parseInt(fieldValue) === 0) return null;
    secondsText = handleNumeric(fieldValue, fieldName);
  }
  return secondsText;
}

export function handleMinutes(fieldValue, fieldName) {
  let minutesText = "";
  if (fieldValue === "*" || fieldValue === "?") {
    minutesText = handleAsterisk(fieldName);
  } else if (fieldValue.includes("/")) {
    minutesText = handleStep(fieldValue, fieldName);
  } else if (fieldValue.includes("-")) {
    minutesText = handleRange(fieldValue, fieldName);
  } else if (fieldValue.includes(",")) {
    minutesText = handleComma(fieldValue, fieldName);
  } else {
    if (parseInt(fieldValue) === 0) return null;
    minutesText = handleNumeric(fieldValue, fieldName);
  }
  return minutesText;
}

export function handleHours(fieldValue, fieldName) {
  let hoursText = "";
  if (fieldValue === "*" || fieldValue === "?") {
    hoursText = handleAsterisk(fieldName);
  } else if (fieldValue.includes("/")) {
    hoursText = handleStep(fieldValue, fieldName);
  } else if (fieldValue.includes("-")) {
    hoursText = handleRange(fieldValue, fieldName);
  } else if (fieldValue.includes(",")) {
    hoursText = handleComma(fieldValue, fieldName);
  } else {
    if (parseInt(fieldValue) === 0) return null;
    hoursText = handleNumeric(fieldValue, fieldName);
  }
  return hoursText;
}

export function handleDayOfMonthField(fieldValue, fieldName) {
  let dayOfMonthText = "";
  if (fieldValue === "*" || fieldValue === "?") {
    dayOfMonthText = handleAsterisk(fieldName);
  } else if (fieldValue.includes("/")) {
    dayOfMonthText = handleStep(fieldValue, fieldName);
  } else if (fieldValue.includes("-")) {
    dayOfMonthText = handleRange(fieldValue, fieldName);
  } else if (fieldValue.includes(",")) {
    dayOfMonthText = handleComma(fieldValue, fieldName);
  } else {
    if (parseInt(fieldValue) === 0) return null;
    dayOfMonthText = handleNumeric(fieldValue, fieldName);
  }
  return dayOfMonthText;
}

export function handleMonth(fieldValue, fieldName) {
  let monthText = "";
  if (fieldValue === "*" || fieldValue === "?") {
    monthText = handleAsterisk(fieldName);
  } else if (fieldValue.includes("/")) {
    monthText = handleStep(fieldValue, fieldName);
  } else if (fieldValue.includes("-")) {
    monthText = handleRange(fieldValue, fieldName);
  } else if (fieldValue.includes(",")) {
    monthText = handleComma(fieldValue, fieldName);
  } else {
    if (parseInt(fieldValue) === 0) return null;
    monthText = handleNumeric(fieldValue, fieldName);
  }
  return monthText;
}

export function handleDayOfWeek(fieldValue, fieldName) {
  let dayOfWeekText = "";
  if (fieldValue === "*" || fieldValue === "?") {
    dayOfWeekText = handleAsterisk(fieldName);
  } else if (fieldValue.includes("/")) {
    dayOfWeekText = handleStep(fieldValue, fieldName);
  } else if (fieldValue.includes("-")) {
    dayOfWeekText = handleRange(fieldValue, fieldName);
  } else if (fieldValue.includes(",")) {
    dayOfWeekText = handleComma(fieldValue, fieldName);
  } else {
    if (parseInt(fieldValue) === 0) return null;
    dayOfWeekText = handleNumeric(fieldValue, fieldName);
  }
  return dayOfWeekText;
}
