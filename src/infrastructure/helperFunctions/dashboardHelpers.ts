  
export function getDateKeyWithInterval(start: Date, end: Date, date: Date, interval: number = 5): string {
    // Ensure start date is the beginning of an interval
    const adjustedStartDate = new Date(start.getFullYear(), start.getMonth(), start.getDate() - start.getDay() % interval);
  
    // Check if the given date falls within the start-end range
    if (date < adjustedStartDate || date > end) {
      throw new Error("Date is outside the specified range.");
    }
  
    // Calculate the start and end of the interval containing the given date
    const intervalStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() % interval);
    let intervalEnd = new Date(intervalStart.getTime() + (interval - 1) * 24 * 60 * 60 * 1000); // Add (interval - 1) days
  
    // Clamp interval end to the specified end date
    if (intervalEnd > end) {
      intervalEnd = new Date(end);
    }
  
    // Format the string based on the interval
    if (interval === 1) {
      return intervalStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return `${intervalStart.toLocaleDateString('en-US', { month: 'short' })} ${intervalStart.getDate()} - ${intervalEnd.toLocaleDateString('en-US', { month: 'short' })} ${intervalEnd.getDate()}`;
    }
}
  