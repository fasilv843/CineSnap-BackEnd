export interface IShow {
    _id: string
    movieId: string
    screenId: string
    startTime: Date
    endTime: Date
    totalSeatCount: number
    availableSeatCount: number
    seatId: string
}