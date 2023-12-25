export function calculateHoursDifference (targetDate: Date): number {
    const currentDate = new Date();
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60); // convert milliseconds to hours
    return hoursDifference
}
  

export function isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
}

export function isPast(date: Date): boolean {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    return date < yesterday;
}