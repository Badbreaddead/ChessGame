export const localDateTime = (utcDateTime: string) => {
  return new Date(utcDateTime);
};

export const formatDateTime = (date: Date) => {
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};
