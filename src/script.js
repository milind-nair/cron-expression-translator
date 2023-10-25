function translateSpringCronExpression(expression) {
  const cronFieldNames = [
    "second",
    "minute",
    "hour",
    "day of the month",
    "month",
    "day of the week",
  ];
  const cronFieldDescriptions = [];
  const cronFields = expression.split(" ");
  console.log(cronFields);
  function handleAsterisk(fieldName) {
    // console.log(fieldName);
    fieldName.push(`every ${fieldName[0]}`);
    // console.log(fieldName);
  }

  function handleRange(rangeStr, fieldName) {
    const [start, end] = rangeStr.split("-");
    fieldName.push(`from ${start} to ${end} ${fieldName[0]}`);
  }

  function handleStep(field, fieldName) {
    console.log(field);
    console.log(fieldName);
    const [range, step] = field.split("/");
    fieldName.push(`every ${step} ${fieldName[0]}`);
    if (range.includes("-")) {
      handleRange(range, fieldName);
    }
  }

  for (let i = 0; i < 6; i++) {
    const field = cronFields[i];
    const fieldName = [cronFieldNames[i]];

    if (field === "*") {
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
    } 
    // TODO: Handle if the field is numeric
    else {
      fieldName.push(field);
    }

    fieldName[0] = fieldName.slice(1).join(" ");
    cronFieldDescriptions.push(fieldName[0]);
  }

  const description = cronFieldDescriptions.join(", ");

  return description;
}

// Example usage:
const cronExpression = "0 0 8-10/1 * * *"; // Sample Spring cron expression
const humanReadable = translateSpringCronExpression(cronExpression);
console.log(humanReadable); // Output the human-readable description
