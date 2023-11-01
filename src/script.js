function translateSpringCronExpression(expression) {
  const cronFieldNames = [
    "second",
    "minute",
    "hour",
    "day of the month",
    "month",
    "day of the week",
  ];

  const dayMap = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
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
    let offsetStr = null;
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

  for (let i = 0; i < 6; i++) {
    let exclude = false;
    const field = cronFields[i];
    const fieldName = [cronFieldNames[i]];
    if (i === 5) {
      fieldName.push(handleWeek(field));
    } else {
      if (field === "*" || field === "?") {
        handleAsterisk(fieldName);
      } else if (field.includes("/")) {
        handleStep(field, fieldName);
      } else if (field.includes("-")) {
        handleRange(field, fieldName);
      } else if (field.includes(",")) {
        const values = field.split(",");
        fieldName.push("At");
        fieldName.push(values.join(" and "));
        fieldName.push(`${fieldName[0]}s`);
      } else {
        handleNumeric(field, fieldName);
        if (parseInt(field) === 0) exclude = true;
      }
    }

    if (!exclude) {
      fieldName[0] = fieldName.slice(1).join(" ");
      cronFieldDescriptions.push(fieldName[0]);
    }
  }

  const description = cronFieldDescriptions.join(", ");

  return description;
}

// Example usage:
const cronExpression = "0 0 0 ? * MON#2"; 
const humanReadable = translateSpringCronExpression(cronExpression);
console.log(humanReadable); 

// TODO :
// Fix L character issues :
// In the "day of month" field, L stands for "the last day of the month". If followed by an negative offset (i.e. L-n), it means "nth-to-last day of the month". If followed by W (i.e. LW), it means "the last weekday of the month".
// The "day of month" field can be nW, which stands for "the nearest weekday to day of the month n". If n falls on Saturday, this yields the Friday before it. If n falls on Sunday, this yields the Monday after, which also happens if n is 1 and falls on a Saturday (i.e. 1W stands for "the first weekday of the month").
