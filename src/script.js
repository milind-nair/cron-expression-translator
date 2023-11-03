const translateSpringCronExpression = (expression) => {
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

  const monthMap = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
  function handleComma(field, fieldName) {
    const values = field.split(",");
    fieldName.push("At");
    fieldName.push(values.join(" and "));
    fieldName.push(`${fieldName[0]}s`);
  }

  function offsetToText(offset) {
    if (offset === 1 || offset === -1) return "the last";
    if (offset > 1) return `the ${offset}${getNumberSuffix(offset)}-to-last`;
    return offset;
  }

  function handleDayOfMonth(dayOfMonth) {
    let dayOfMonthText = "";
    if (dayOfMonth === "*" || dayOfMonth === "?")
      return "Every day of the Month";
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

  function handleWeek(dayOfWeek) {
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

  for (let i = 0; i < 6; i++) {
    let exclude = false;
    const field = cronFields[i];
    const fieldName = [cronFieldNames[i]];
    if (i === 5) {
      fieldName.push(handleWeek(field));
    } else if (i === 3) {
      fieldName.push(handleDayOfMonth(field));
    } else {
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

    if (!exclude) {
      fieldName[0] = fieldName.slice(1).join(" ");
      cronFieldDescriptions.push(fieldName[0]);
    }
  }

  const description = cronFieldDescriptions.join(", ");

  return description;
};

// TODO : Extract each parameter call to a separate function
// 1) MON-FRI or 3-5 in Day of Week Function

// TODO : When both day of week and day of month parameters are present , give precedence to day of month (Eg :  On 25th December only if its a Friday)
module.exports = translateSpringCronExpression;
