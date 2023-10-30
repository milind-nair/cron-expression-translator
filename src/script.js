function translateSpringCronExpression(expression) {
  const cronFieldNames = [
    "second",
    "minute",
    "hour",
    "day of the month",
    "month",
    "day of the week",
  ];
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

  const cronFieldDescriptions = [];
  const cronFields = expression.split(" ");
  console.log(cronFields);
  function handleAsterisk(fieldName) {
    fieldName.push(`Every ${fieldName[0]}`);
  }

  function handleRange(rangeStr, fieldName) {
    const [start, end] = rangeStr.split("-");
    fieldName.push(
      `From the ${start}${getNumberSuffix(
        parseInt(start)
      )} to ${end}${getNumberSuffix(parseInt(end))} ${fieldName[0]}`
    );
  }

  function handleStep(field, fieldName) {
    const [range, step] = field.split("/");
    if (parseInt(step) !== 1) fieldName.push(`Every ${step} ${fieldName[0]}s`);
    else fieldName.push(`Every ${fieldName[0]}`);
    if (range.includes("-")) {
      handleRange(range, fieldName);
    }
  }
  function handleNumeric(field, fieldName) {
    fieldName.push(
      `${field}${getNumberSuffix(parseInt(field))} ${fieldName[0]}`
    );
  }

  function offsetToText(offset) {
    if (offset === 1 || offset === -1) return "the last";
    if (offset > 1) return `the ${offset}th-to-last`;
    return offset;
  }

  function handleMonth(dayOfMonth) {
    let dayOfMonthText = "";
    if (dayOfMonth === "L") {
      dayOfMonthText = "the last day of the month";
    } else if (dayOfMonth.startsWith("L-")) {
      const offset = offsetToText(-parseInt(dayOfMonth.substring(2)));
      dayOfMonthText = `${offset} day of the month from the end`;
    } else if (dayOfMonth === "LW") {
      dayOfMonthText = "the last weekday of the month";
    } else {
      dayOfMonthText = parseInt(dayOfMonth);
    }
    return dayOfMonthText;
  }

  function handleWeek(dayOfWeek) {
    let dayOfWeekText = "";
    if (dayOfWeek.startsWith("dL")) {
      const day = dayOfWeek.substring(2);
      dayOfWeekText = `the last ${day} of the month`;
    } else if (dayOfWeek.startsWith("DDDL")) {
      const day = dayOfWeek.substring(4);
      dayOfWeekText = `the last ${day} of the month`;
    } else {
      dayOfWeekText = dayOfWeek;
    }

    return dayOfWeekText;
  }

  for (let i = 0; i < 6; i++) {
    const field = cronFields[i];
    const fieldName = [cronFieldNames[i]];
    let exclude = false;
    if (field === "*" || field === "?") {
      handleAsterisk(fieldName);
    } else if (field.includes("/")) {
      handleStep(field, fieldName);
    } else if (field.includes("-")) {
      handleRange(field, fieldName);
    } else if (field.includes(",")) {
      const values = field.split(",");
      fieldName.push("at");
      values.forEach((value) => {
        if (value === "L") {
          fieldName.push("the last day");
        } else {
          fieldName.push(value);
        }
      });
    } else {
      handleNumeric(field, fieldName);
      if (parseInt(field) === 0) exclude = true;
    }
    console.log(fieldName);
    if (!exclude) {
      fieldName[0] = fieldName.slice(1).join(" ");
      cronFieldDescriptions.push(fieldName[0]);
    }
  }

  const description = cronFieldDescriptions.join(", ");

  return description;
}

// Example usage:
const cronExpression = "0 0 8-10/1 * * *"; // Sample Spring cron expression
const humanReadable = translateSpringCronExpression(cronExpression);
console.log(humanReadable); // Output the human-readable description

// TODO :
// Fix L character issues :
// The "day of month" and "day of week" fields can contain a L-character, which stands for "last", and has a different meaning in each field:
// In the "day of month" field, L stands for "the last day of the month". If followed by an negative offset (i.e. L-n), it means "nth-to-last day of the month". If followed by W (i.e. LW), it means "the last weekday of the month".
// In the "day of week" field, dL or DDDL stands for "the last day of week d (or DDD) in the month".
