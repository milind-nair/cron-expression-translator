import translateSpringCronExpression from "../script.js";

describe("Cron Expression Translator", () => {
  test('should translate "0 0 * * * *" to "the top of every hour of every day"', () => {
    expect(translateSpringCronExpression("0 0 * * * *")).toBe(
      "the top of every hour of every day"
    );
  });

  test('should translate "*/10 * * * * *" to "every ten seconds"', () => {
    expect(translateSpringCronExpression("*/10 * * * * *")).toBe(
      "every ten seconds"
    );
  });

  test('should translate "0 0 8-10 * * *" to "8, 9 and 10 o\'clock of every day"', () => {
    expect(translateSpringCronExpression("0 0 8-10 * * *")).toBe(
      "8, 9 and 10 o'clock of every day"
    );
  });

  test('should translate "0 0 6,19 * * *" to "6:00 AM and 7:00 PM every day"', () => {
    expect(translateSpringCronExpression("0 0 6,19 * * *")).toBe(
      "6:00 AM and 7:00 PM every day"
    );
  });

  test('should translate "0 0/30 8-10 * * *" to "8:00, 8:30, 9:00, 9:30, 10:00 and 10:30 every day"', () => {
    expect(translateSpringCronExpression("0 0/30 8-10 * * *")).toBe(
      "8:00, 8:30, 9:00, 9:30, 10:00 and 10:30 every day"
    );
  });

  test('should translate "0 0 9-17 * * MON-FRI" to "on the hour nine-to-five weekdays"', () => {
    expect(translateSpringCronExpression("0 0 9-17 * * MON-FRI")).toBe(
      "on the hour nine-to-five weekdays"
    );
  });

  test('should translate "0 0 0 25 12 ?" to "every Christmas Day at midnight"', () => {
    expect(translateSpringCronExpression("0 0 0 25 12 ?")).toBe(
      "at midnight, on 25th December"
    );
  });

  test('should translate "0 0 0 L * *" to "last day of the month at midnight"', () => {
    expect(translateSpringCronExpression("0 0 0 L * *")).toBe(
      "last day of the month at midnight"
    );
  });

  test('should translate "0 0 0 L-3 * *" to "third-to-last day of the month at midnight"', () => {
    expect(translateSpringCronExpression("0 0 0 L-3 * *")).toBe(
      "third-to-last day of the month at midnight"
    );
  });

  test('should translate "0 0 0 1W * *" to "first weekday of the month at midnight"', () => {
    expect(translateSpringCronExpression("0 0 0 1W * *")).toBe(
      "first weekday of the month at midnight"
    );
  });

  test('should translate "0 0 0 LW * *" to "last weekday of the month at midnight"', () => {
    expect(translateSpringCronExpression("0 0 0 LW * *")).toBe(
      "last weekday of the month at midnight"
    );
  });

  test('should translate "0 0 0 * * 5L" to "last Friday of the month at midnight"', () => {
    expect(translateSpringCronExpression("0 0 0 * * 5L")).toBe(
      "last Friday of the month at midnight"
    );
  });

  test('should translate "0 0 0 * * THUL" to "last Thursday of the month at midnight"', () => {
    expect(translateSpringCronExpression("0 0 0 * * THUL")).toBe(
      "last Thursday of the month at midnight"
    );
  });

  test('should translate "0 0 0 ? * 5#2" to "the second Friday in the month at midnight"', () => {
    expect(translateSpringCronExpression("0 0 0 ? * 5#2")).toBe(
      "the second Friday in the month at midnight"
    );
  });

  test('should translate "0 0 0 ? * MON#1" to "the first Monday in the month at midnight"', () => {
    expect(translateSpringCronExpression("0 0 0 ? * MON#1")).toBe(
      "At 00:00:00 AM, Every day of the month, the 1st Monday in the month, Every month"
    );
  });
});
