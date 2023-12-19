import { IDuration } from "../../interfaces/schema/movieSchema";

export function getEndingTime(startTime: Date, duration: IDuration): Date {
    const endingTime = new Date(startTime); // Create a new Date object to avoid mutating the original startTime
  
    endingTime.setHours(endingTime.getHours() + duration.hours);
    endingTime.setMinutes(endingTime.getMinutes() + duration.minutes);
  
    return endingTime;
  }