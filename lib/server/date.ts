export const FiveMinutesFromNow = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};

export const ThirtyDaysFromNow = () => {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
};
