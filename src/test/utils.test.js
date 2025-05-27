// test_utils.js
import {
  getFullDayName,
  getNumberSuffix,
  handleAsterisk,
  handleRange,
  handleStep,
  handleNumeric,
  handleComma,
  handleWeek,
  handleDayOfMonth,
  handleSeconds,
  handleMinutes,
  handleHours,
  handleDayOfMonthField,
  handleMonth,
  handleDayOfWeek,
} from "../utils.js";

describe("getFullDayName", () => {
  it("should return the full day name for a given abbreviation", () => {
    expect(getFullDayName("mon")).toBe("Monday");
    expect(getFullDayName("tue")).toBe("Tuesday");
    expect(getFullDayName("wed")).toBe("Wednesday");
    expect(getFullDayName("thu")).toBe("Thursday");
    expect(getFullDayName("fri")).toBe("Friday");
    expect(getFullDayName("sat")).toBe("Saturday");
    expect(getFullDayName("sun")).toBe("Sunday");
  });

  it('should return "Invalid day abbreviation" for an invalid abbreviation', () => {
    expect(getFullDayName("abc")).toBe("Invalid day abbreviation");
  });
});

describe("getNumberSuffix", () => {
  it("should return the correct suffix for a given number", () => {
    expect(getNumberSuffix(1)).toBe("st");
    expect(getNumberSuffix(2)).toBe("nd");
    expect(getNumberSuffix(3)).toBe("rd");
    expect(getNumberSuffix(4)).toBe("th");
    expect(getNumberSuffix(11)).toBe("th");
    expect(getNumberSuffix(12)).toBe("th");
    expect(getNumberSuffix(13)).toBe("th");
  });

  it('should return "Invalid input" for a non-numeric input', () => {
    expect(getNumberSuffix("abc")).toBe("Invalid input");
  });
});

describe("handleAsterisk", () => {
  it("should return the correct string for an asterisk", () => {
    expect(handleAsterisk("minute")).toBe("Every minute");
    expect(handleAsterisk("hour")).toBe("Every hour");
  });
});

describe("handleRange", () => {
  it("should return the correct string for a range", () => {
    expect(handleRange("1-5", "minute")).toBe("From the 1st to 5th minute");
    expect(handleRange("10-20", "hour")).toBe("From the 10th to 20th hour");
  });
  it("should return the correct string for a day of the week range", () => {
    expect(handleRange("1-5", "day of the week")).toBe("Monday through Friday");
  });
  it("should return the correct string for a day of the month range", () => {
    expect(handleRange("1-5", "day of the month")).toBe("on day 1 through 5");
  });
});

describe("handleStep", () => {
  it("should return the correct string for a step", () => {
    expect(handleStep("1/2", "minute")).toBe("Every 2 minutes");
    expect(handleStep("5/10", "hour")).toBe("Every 10 hours");
  });

  it("should return the correct string for a step with a range", () => {
    expect(handleStep("1-5/2", "minute")).toBe(
      "Every 2 minutesFrom the 1st to 5th minute"
    );
  });
});

it("should return the correct string for a step with day of the month", () => {
  expect(handleStep("1/2", "day of the month")).toBe(
    "every 2nd day of the month"
  );
  expect(handleStep("1-5/2", "day of the month")).toBe(
    "every 2nd day, on day 1 through 5 of the month"
  );
});

it("should return the correct string for a step with month", () => {
  expect(handleStep("1/2", "month")).toBe("Every 2 months");
  expect(handleStep("1-5/2", "month")).toBe(
    "Every 2 months, only in January through May"
  );
});

it("should return the correct string for a step with day of the week", () => {
  expect(handleStep("1/2", "day of the week")).toBe(
    "every 2nd day of the week"
  );
  expect(handleStep("1-5/2", "day of the week")).toBe(
    "every 2nd day of the week, Monday through Friday"
  );
});

describe("handleNumeric", () => {
  it("should return the correct string for a numeric value", () => {
    expect(handleNumeric("1", "minute")).toBe("1st minute");
    expect(handleNumeric("5", "hour")).toBe("5th hour");
  });

  it("should return the correct string for a numeric month", () => {
    expect(handleNumeric("1", "month")).toBe("only in January");
  });

  it("should return the correct string for a numeric day of the week", () => {
    expect(handleNumeric("1", "day of the week")).toBe("only on Monday");
  });

  it("should return the correct string for a numeric day of the month", () => {
    expect(handleNumeric("1", "day of the month")).toBe("on day 1");
  });
});

describe("handleComma", () => {
  it("should return the correct string for a comma-separated list", () => {
    expect(handleComma("1,2,3", "minute")).toBe("At 1st, 2nd and 3rd minutes");
    expect(handleComma("5,10,15", "hour")).toBe("At 5th, 10th and 15th hours");
  });
});

it("should return the correct string for a comma-separated list of days of the week", () => {
  expect(handleComma("1,2,3", "day of the week")).toBe(
    "only on Monday, Tuesday and Wednesday"
  );
});

it("should return the correct string for a comma-separated list of days of the month", () => {
  expect(handleComma("1,2,3", "day of the month")).toBe(
    "on day 1, day 2 and day 3"
  );
});

it("should return the correct string for a comma-separated list of months", () => {
  expect(handleComma("1,2,3", "month")).toBe(
    "only in January, February and March"
  );
});

it("should return the correct string for a single value", () => {
  expect(handleComma("1", "minute")).toBe("At 1st minute");
  expect(handleComma("1", "day of the week")).toBe("only on Monday");
  expect(handleComma("1", "day of the month")).toBe("on day 1");
  expect(handleComma("1", "month")).toBe("only in January");
});

describe("handleWeek", () => {
  it("should return the correct string for a weekday", () => {
    expect(handleWeek("1")).toBe("On Monday");
    expect(handleWeek("2")).toBe("On Tuesday");
  });

  it("should return the correct string for a weekday with an offset", () => {
    expect(handleWeek("1#2")).toBe("On the 2nd Monday");
  });

  it("should return the correct string for the last weekday of the month (numeric)", () => {
    expect(handleWeek("1L")).toBe("last Monday of the month");
  });

  it("should return the correct string for the last weekday of the month (abbreviation)", () => {
    expect(handleWeek("MONL")).toBe("last Monday of the month");
  });

  it("should return the correct string for a full day name", () => {
    expect(handleWeek("MON")).toBe("On Monday");
  });

  it("should return the correct string for the last day of the week of the month", () => {
    expect(handleWeek("L")).toBe("last day of the week of the month");
  });


  it("should return the correct string for the 2nd-to-last day of the week of the month from the end", () => {
    expect(handleWeek("L-2")).toBe("Any day of the week");
  });

  it("should return the correct string for the nearest weekday to a day of the month", () => {
    expect(handleWeek("1W")).toBe("On Monday");
  });
});

describe("handleDayOfMonth", () => {
  it("should return the correct string for a day of the month", () => {
    expect(handleDayOfMonth("1")).toBe("on day 1");
    expect(handleDayOfMonth("5")).toBe("on day 5");
  });

  it("should return the correct string for the last day of the month", () => {
    expect(handleDayOfMonth("L")).toBe("last day of the month");
  });

  it("should return the correct string for the last day of the month with an offset", () => {
    expect(handleDayOfMonth("L-2")).toBe(
      "second-to-last day of the month"
    );
  });

  it("should return the correct string for the last weekday of the month", () => {
    expect(handleDayOfMonth("LW")).toBe("last weekday of the month");
  });

  it("should return the correct string for the nearest weekday to a day of the month", () => {
    expect(handleDayOfMonth("1W")).toBe(
      "the nearest weekday to the 1st day of the month"
    );
  });
});

it("should return the correct string for the 1st-to-last day of the month from the end", () => {
  expect(handleDayOfMonth("L-1")).toBe(
    "last day of the month"
  );
});

it("should return the correct string for the 0-to-last day of the month from the end", () => {
  expect(handleDayOfMonth("L-0")).toBe("last day of the month");
});

describe("handleSeconds", () => {
  it("should return the correct string for seconds", () => {
    expect(handleSeconds("*", "second")).toBe("Every second");
    expect(handleSeconds("1", "second")).toBe("1st second");
    expect(handleSeconds("1/2", "second")).toBe("Every 2 seconds");
    expect(handleSeconds("1-5", "second")).toBe("From the 1st to 5th second");
    expect(handleSeconds("1,2,3", "second")).toBe(
      "At 1st, 2nd and 3rd seconds"
    );
  });
  it("should return null for 0 seconds", () => {
    expect(handleSeconds("0", "second")).toBeNull();
  });
});

describe("handleMinutes", () => {
  it("should return the correct string for minutes", () => {
    expect(handleMinutes("*", "minute")).toBe("Every minute");
    expect(handleMinutes("1", "minute")).toBe("1st minute");
    expect(handleMinutes("1/2", "minute")).toBe("Every 2 minutes");
    expect(handleMinutes("1-5", "minute")).toBe("From the 1st to 5th minute");
    expect(handleMinutes("1,2,3", "minute")).toBe(
      "At 1st, 2nd and 3rd minutes"
    );
  });
  it("should return null for 0 minutes", () => {
    expect(handleMinutes("0", "minute")).toBeNull();
  });
});

describe("handleHours", () => {
  it("should return the correct string for hours", () => {
    expect(handleHours("*", "hour")).toBe("Every hour");
    expect(handleHours("1", "hour")).toBe("1st hour");
    expect(handleHours("1/2", "hour")).toBe("Every 2 hours");
    expect(handleHours("1-5", "hour")).toBe("From the 1st to 5th hour");
    expect(handleHours("1,2,3", "hour")).toBe("At 1st, 2nd and 3rd hours");
  });
});
it("should return null for 0 hours", () => {
  expect(handleHours("0", "hour")).toBeNull();
});

describe("handleDayOfMonthField", () => {
  it("should return the correct string for day of month field", () => {
    expect(handleDayOfMonthField("*", "day of month")).toBe(
      "Every day of month"
    );
    expect(handleDayOfMonthField("1", "day of month")).toBe("1st day of month");
    expect(handleDayOfMonthField("1/2", "day of month")).toBe(
      "Every 2 day of months"
    );
    expect(handleDayOfMonthField("1-5", "day of month")).toBe(
      "From the 1st to 5th day of month"
    );
    expect(handleDayOfMonthField("1,2,3", "day of month")).toBe(
      "At 1st, 2nd and 3rd day of months"
    );
  });
});

describe("handleMonth", () => {
  it("should return the correct string for month", () => {
    expect(handleMonth("*", "month")).toBe("Every month");
    expect(handleMonth("1", "month")).toBe("only in January");
    expect(handleMonth("1/2", "month")).toBe("Every 2 months");
    expect(handleMonth("1-5", "month")).toBe("From the 1st to 5th month");
    expect(handleMonth("1,2,3", "month")).toBe(
      "only in January, February and March"
    );
  });
});

describe("handleDayOfWeek", () => {
  it("should return the correct string for day of week", () => {
    expect(handleDayOfWeek("*", "day of week")).toBe("Every day of week");
    expect(handleDayOfWeek("1", "day of week")).toBe("1st day of week");
    expect(handleDayOfWeek("1/2", "day of week")).toBe("Every 2 day of weeks");
    expect(handleDayOfWeek("1-5", "day of week")).toBe(
      "From the 1st to 5th day of week"
    );
    expect(handleDayOfWeek("1,2,3", "day of week")).toBe(
      "At 1st, 2nd and 3rd day of weeks"
    );
  });
});
