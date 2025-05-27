import { dayMap } from "../constants.js";

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

export function offsetToText(offset) {
  if (offset === 1) return "last";
  if (offset === 2) return "second-to-last";
  if (offset === 3) return "third-to-last";
  if (offset > 3) return `${offset}${getNumberSuffix(offset)}-to-last`;
  return offset;
}