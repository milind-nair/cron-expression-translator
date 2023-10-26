# Spring Cron To Human Readable Text

This Javascript library provides support for translation of Spring Cron Expressions to human readable text (English, for now). 

## Usage 
``` 
import translateSpringCronExpression from cron-expression-translator;

const inputCronString = "0 0 8-10/1 * * *";

const humanReadableText = translateSpringCronExpression(inputCronString);

// sample output : Every hour From the 8th to 10th hour, Every day of the month, Every month, Every day of the week
```

# About Spring Cron

The Spring Cron Expression has 6 fields:

1. Second (0-59)

2. Minute (0 - 59)

3. Hour (0 - 23)

4. Day of the month (1 - 31)

5. Month (1 - 12) (or JAN-DEC)

6. Day of the week (0 - 7) (0 or 7 is Sunday, or MON-SUN)

## The following rules apply:

1. A field may be an asterisk (\*), which always stands for "first-last". For the "day of the month" or "day of the week" fields, a question mark (?) may be used instead of an asterisk.
2. Ranges of numbers are expressed by two numbers separated with a hyphen (-). The specified range is inclusive.
3. Following a range (or \*) with /n specifies the interval of the number's value through the range.
4. English names can also be used for the "month" and "day of week" fields. Use the first three letters of the particular day or month (case does not matter).
5. The "day of month" and "day of week" fields can contain a L-character, which stands for "last", and has a different meaning in each field:

   1. In the "day of month" field, L stands for "the last day of the month". If followed by an negative offset (i.e. L-n), it means "nth-to-last day of the month". If followed by W (i.e. LW), it means "the last weekday of the month".

   2. In the "day of week" field, dL or DDDL stands for "the last day of week d (or DDD) in the month".

6. The "day of month" field can be nW, which stands for "the nearest weekday to day of the month n". If n falls on Saturday, this yields the Friday before it. If n falls on Sunday, this yields the Monday after, which also happens if n is 1 and falls on a Saturday (i.e. 1W stands for "the first weekday of the month").
7. The "day of week" field can be d#n (or DDD#n), which stands for "the n-th day of week d (or DDD) in the month".
