import { dayMap, monthMap, cronFieldNames } from "./constants.js";
import { getFullDayName, getNumberSuffix, offsetToText } from "./lib/formatters.js";
import {
  handleAsterisk,
  handleRange,
  handleStep,
  handleNumeric,
  handleComma,
  handleWeekSpecials,
  handleDayOfMonthSpecials,
} from "./lib/fieldValueParsers.js";

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
  const specialHandling = handleDayOfMonthSpecials(fieldValue);
  if (specialHandling) {
    return specialHandling;
  }
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
  const specialHandling = handleWeekSpecials(fieldValue);
  if (specialHandling) {
    return specialHandling;
  }
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
