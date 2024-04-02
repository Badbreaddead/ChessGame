import { localDateTime } from "./datetime";

export const sortByDates =
  <T>(key: keyof T) =>
  (a: T, b: T) => {
    const aDate = localDateTime(String(a[key]));
    const bDate = localDateTime(String(b[key]));
    return bDate.getTime() - aDate.getTime();
  };
