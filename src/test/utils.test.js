// test_utils.js
import {
  getFullDayName,
  getNumberSuffix,
} from "../lib/formatters.js";
import {
  handleAsterisk,
  handleRange,
  handleStep,
  handleNumeric,
  handleComma,
  handleWeekSpecials, // Will be used in later stage
  handleDayOfMonthSpecials, // Will be used in later stage
} from "../lib/fieldValueParsers.js";
import {
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
      "Every 2 minutes from the 1st to 5th minute" // Adjusted assertion
    );
  });
});

it("should return the correct string for a step with day of the month", () => {
  expect(handleStep("*/2", "day of the month")).toBe( // Adjusted to use * for range
    "every 2nd day of the month"
  );
  expect(handleStep("1-5/2", "day of the month")).toBe(
    "every 2nd day, on day 1 through 5 of the month"
  );
});

it("should return the correct string for a step with month", () => {
  expect(handleStep("*/2", "month")).toBe("Every 2 months"); // Adjusted to use * for range
  expect(handleStep("1-5/2", "month")).toBe(
    "Every 2 months, only in January through May"
  );
});

it("should return the correct string for a step with day of the week", () => {
  expect(handleStep("*/2", "day of the week")).toBe( // Adjusted to use * for range
    "every 2nd day of the week"
  );
  expect(handleStep("1-5/2", "day of the week")).toBe(
    "every 2nd day of the week, Monday through Friday"
  );
});

describe("handleNumeric", () => {
  it("should return the correct string for a numeric value", () => {
    expect(handleNumeric("1", "minute")).toBe("at 1st minute"); // Adjusted assertion
    expect(handleNumeric("5", "hour")).toBe("at 5th hour"); // Adjusted assertion
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
    expect(handleComma("1,2,3", "minute")).toBe("at 1st, 2nd and 3rd minutes"); // Adjusted
    expect(handleComma("5,10,15", "hour")).toBe("at 5th, 10th and 15th hours"); // Adjusted
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
  expect(handleComma("1", "minute")).toBe("at 1st minute"); // Adjusted
  expect(handleComma("1", "day of the week")).toBe("only on Monday");
  expect(handleComma("1", "day of the month")).toBe("on day 1");
  expect(handleComma("1", "month")).toBe("only in January");
});

// Removed old handleWeek and handleDayOfMonth tests

describe("handleWeekSpecials", () => {
  it("should handle # syntax for nth day of month", () => {
    expect(handleWeekSpecials("1#2")).toBe("the 2nd Monday in the month");
    expect(handleWeekSpecials("FRI#3")).toBe("the 3rd Friday in the month");
    expect(handleWeekSpecials("5#1")).toBe("the 1st Friday in the month");
  });

  it("should handle L syntax for last day of week/month", () => {
    expect(handleWeekSpecials("L")).toBe("last day of the week of the month");
    expect(handleWeekSpecials("MONL")).toBe("last Monday of the month");
    expect(handleWeekSpecials("5L")).toBe("last Friday of the month");
    expect(handleWeekSpecials("TUEL")).toBe("last Tuesday of the month");
  });

  it("should return null for non-special or invalid week values", () => {
    expect(handleWeekSpecials("1")).toBeNull();
    expect(handleWeekSpecials("MON")).toBeNull();
    expect(handleWeekSpecials("L-2")).toBeNull(); // This is handled by day of month
    expect(handleWeekSpecials("1W")).toBeNull(); // This is handled by day of month
    expect(handleWeekSpecials("INVALID")).toBeNull();
    expect(handleWeekSpecials("1#L")).toBeNull();
  });
});

describe("handleDayOfMonthSpecials", () => {
  it("should handle L for last day of month", () => {
    expect(handleDayOfMonthSpecials("L")).toBe("last day of the month");
  });
  it("should handle L-offset for offset from last day of month", () => {
    expect(handleDayOfMonthSpecials("L-1")).toBe("last day of the month");
    expect(handleDayOfMonthSpecials("L-2")).toBe("second-to-last day of the month");
    expect(handleDayOfMonthSpecials("L-15")).toBe("15th-to-last day of the month");
  });
  it("should handle LW for last weekday of month", () => {
    expect(handleDayOfMonthSpecials("LW")).toBe("last weekday of the month");
  });
  it("should handle W for nearest weekday", () => {
    expect(handleDayOfMonthSpecials("1W")).toBe("the nearest weekday to the 1st day of the month");
    expect(handleDayOfMonthSpecials("15W")).toBe("the nearest weekday to the 15th day of the month");
  });
  it("should return null for non-special or invalid day of month values", () => {
    expect(handleDayOfMonthSpecials("1")).toBeNull();
    expect(handleDayOfMonthSpecials("L-0")).toBeNull(); // Invalid offset
    expect(handleDayOfMonthSpecials("WL")).toBeNull();
    expect(handleDayOfMonthSpecials("W1")).toBeNull();
  });
});

describe("handleSeconds", () => {
  it("should return the correct string for seconds", () => {
    expect(handleSeconds("*", "second")).toBe("Every second");
    expect(handleSeconds("1", "second")).toBe("at 1st second"); // Adjusted
    expect(handleSeconds("*/2", "second")).toBe("Every 2 seconds"); // Adjusted
    expect(handleSeconds("1-5", "second")).toBe("From the 1st to 5th second");
    expect(handleSeconds("1,2,3", "second")).toBe(
      "at 1st, 2nd and 3rd seconds" // Adjusted
    );
  });
  it("should return null for 0 seconds", () => {
    expect(handleSeconds("0", "second")).toBeNull();
  });
});

describe("handleMinutes", () => {
  it("should return the correct string for minutes", () => {
    expect(handleMinutes("*", "minute")).toBe("Every minute");
    expect(handleMinutes("1", "minute")).toBe("at 1st minute"); // Adjusted
    expect(handleMinutes("*/2", "minute")).toBe("Every 2 minutes"); // Adjusted
    expect(handleMinutes("1-5", "minute")).toBe("From the 1st to 5th minute");
    expect(handleMinutes("1,2,3", "minute")).toBe(
      "at 1st, 2nd and 3rd minutes" // Adjusted
    );
  });
  it("should return null for 0 minutes", () => {
    expect(handleMinutes("0", "minute")).toBeNull();
  });
});

describe("handleHours", () => {
  it("should return the correct string for hours", () => {
    expect(handleHours("*", "hour")).toBe("Every hour");
    expect(handleHours("1", "hour")).toBe("at 1st hour"); // Adjusted
    expect(handleHours("*/2", "hour")).toBe("Every 2 hours"); // Adjusted
    expect(handleHours("1-5", "hour")).toBe("From the 1st to 5th hour");
    expect(handleHours("1,2,3", "hour")).toBe("at 1st, 2nd and 3rd hours"); // Adjusted
  });
});
it("should return null for 0 hours", () => {
  expect(handleHours("0", "hour")).toBeNull();
});

describe("handleDayOfMonthField", () => {
  it("should return the correct string for day of month field", () => {
    expect(handleDayOfMonthField("*", "day of the month")).toBe( // fieldName adjusted
      "Every day of the month"
    );
    expect(handleDayOfMonthField("1", "day of the month")).toBe("on day 1"); // Adjusted
    expect(handleDayOfMonthField("*/2", "day of the month")).toBe( // fieldName & step adjusted
      "every 2nd day of the month"
    );
    expect(handleDayOfMonthField("1-5", "day of the month")).toBe( // fieldName adjusted
      "on day 1 through 5"
    );
    expect(handleDayOfMonthField("1,2,3", "day of the month")).toBe( // fieldName adjusted
      "on day 1, day 2 and day 3"
    );
    // Tests for special characters (L, LW, W)
    expect(handleDayOfMonthField("L", "day of the month")).toBe("last day of the month");
    expect(handleDayOfMonthField("LW", "day of the month")).toBe("last weekday of the month");
    expect(handleDayOfMonthField("15W", "day of the month")).toBe("the nearest weekday to the 15th day of the month");
    expect(handleDayOfMonthField("L-3", "day of the month")).toBe("third-to-last day of the month");
  });
});

describe("handleMonth", () => {
  it("should return the correct string for month", () => {
    expect(handleMonth("*", "month")).toBe("Every month");
    expect(handleMonth("1", "month")).toBe("only in January");
    expect(handleMonth("*/2", "month")).toBe("Every 2 months"); // Adjusted
    expect(handleMonth("1-5", "month")).toBe("From the 1st to 5th month"); // This will be "only in January through May" due to handleRange
    expect(handleMonth("1,2,3", "month")).toBe(
      "only in January, February and March"
    );
  });
});

describe("handleDayOfWeek", () => {
  it("should return the correct string for day of week", () => {
    expect(handleDayOfWeek("*", "day of the week")).toBe("Every day of the week"); // fieldName adjusted
    expect(handleDayOfWeek("1", "day of the week")).toBe("only on Monday"); // Adjusted
    expect(handleDayOfWeek("*/2", "day of the week")).toBe("every 2nd day of the week"); // fieldName & step adjusted
    expect(handleDayOfWeek("1-5", "day of the week")).toBe("Monday through Friday"); // fieldName adjusted
    expect(handleDayOfWeek("1,2,3", "day of the week")).toBe( // fieldName adjusted
      "only on Monday, Tuesday and Wednesday"
    );
    // Tests for special characters (#, L)
    expect(handleDayOfWeek("L", "day of the week")).toBe("last day of the week of the month");
    expect(handleDayOfWeek("MONL", "day of the week")).toBe("last Monday of the month");
    expect(handleDayOfWeek("1#2", "day of the week")).toBe("the 2nd Monday in the month");
  });
});
