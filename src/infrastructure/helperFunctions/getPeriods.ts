
// this fuction returns starting and ending date of current week of a Weekly coupon
export function getCurrentWeekPeriod(startDate: Date): { weekStart: Date; weekEnd: Date } {
    const currentDate = new Date();
    const daysUntilStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const currentWeekStart = new Date(startDate);
    currentWeekStart.setDate(startDate.getDate() + Math.floor(daysUntilStart / 7) * 7);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

    return { weekStart: currentWeekStart, weekEnd: currentWeekEnd };
}


// returns start as 1st of the month and end as 31st of the month (or last date of the month)
export function getCurrentMonthPeriod(startDate: Date): { monthStart: Date; monthEnd: Date } {
    const currentMonthStart = new Date(startDate);
    currentMonthStart.setDate(1);

    const nextMonthStart = new Date(currentMonthStart);
    nextMonthStart.setMonth(currentMonthStart.getMonth() + 1);

    const monthEnd = new Date(nextMonthStart);
    monthEnd.setDate(monthEnd.getDate() - 1);

    return { monthStart: currentMonthStart, monthEnd };
}

// returns start and end of the year based on startDate
// if start 5th Mar, 2024, yearStart: 5th Mar, Current Year, yearEnd: 4th Mar, Next Year
export function getCurrentYearPeriod(startDate: Date): { yearStart: Date; yearEnd: Date } {
    const currentYearStart = new Date(startDate);
    currentYearStart.setMonth(0, 1);

    const nextYearStart = new Date(currentYearStart);
    nextYearStart.setFullYear(currentYearStart.getFullYear() + 1);

    const yearEnd = new Date(nextYearStart);
    yearEnd.setDate(yearEnd.getDate() - 1);

    return { yearStart: currentYearStart, yearEnd };
}

// returns true if target date is in between start and end date
export function isDateInBetween(targetDate: Date, startDate: Date, endDate: Date): boolean {
    return targetDate >= startDate && targetDate <= endDate;
}