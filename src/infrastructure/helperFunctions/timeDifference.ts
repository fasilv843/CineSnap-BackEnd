export function calculateHoursDifference (targetDate: Date): number {
    const currentDate = new Date();
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60); // convert milliseconds to hours
    return hoursDifference
}
  