export function truncateDateToDay(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return new Date(year, month, day);
}

export function compareDateAtDay(date1: Date, date2: Date) {
  return truncateDateToDay(date1).getTime() === truncateDateToDay(date2).getTime();
}

export function getWeekDay(date: Date) {
  const day = date.getDay();

  const weekday = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  }[day] as 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

  return weekday;
}

export function parseDateToInputString(date: Date) {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  const dateString = date.toISOString().split('T')[0];
  return dateString;
}

export function parseInputStringToDate(dateString: string) {
  const date = new Date(Date.parse(dateString));
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() + offset);
  return date;
}

export function daysDiff(date1: Date, date2: Date) {
  return Math.floor(
    Math.abs(truncateDateToDay(date1).getTime() - truncateDateToDay(date2).getTime()) / 1000 / 60 / 60 / 24
  );
}

export function dateMin(date1: Date, date2: Date) {
  return date1.getTime() > date2.getTime() ? date2 : date1;
}

export function dateMax(date1: Date, date2: Date) {
  return date1.getTime() > date2.getTime() ? date1 : date2;
}
