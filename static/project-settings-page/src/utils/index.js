// generate an array of time from start to stop with step increments
export const generateTimeRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step
  );

// generate an array of options from a list
export const generateOptions = (list) =>
  list.map((x) => ({ label: x, value: x }));

// generate an array of time from 5pm to 9am with 30 minute increments
export function generateTimeList() {
  const timeSlots = [];
  let currentTime = new Date();
  currentTime.setHours(17, 0, 0, 0); // Set initial time to 5:00 PM

  const targetTime = new Date(currentTime);
  targetTime.setDate(currentTime.getDate() + 1); // Set target time to next day
  targetTime.setHours(9, 0, 0, 0); // Set target time to 9:00 AM of the next day

  while (currentTime <= targetTime) {
    const formattedTime = currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    timeSlots.push(formattedTime);
    currentTime.setMinutes(currentTime.getMinutes() + 30); // Increment time by 30 minutes
  }

  return timeSlots;
}
