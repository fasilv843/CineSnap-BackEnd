export interface ITicketSeat {
    seats: string[]
    name: string
    singlePrice: number
    CSFeePerTicket: number
    totalPrice: number
}

export interface ITicket {
    _id: string
    showId: string
    userId: string
    screenId: string
    movieId: string
    theaterId: string
    diamondSeats: ITicketSeat
    goldSeats: ITicketSeat
    silverSeats: ITicketSeat
    totalPrice: number
    seatCount: number
    startTime: Date
    endTime: Date
    isCancelled: boolean
    cancelledBy?: 'User' | 'Theater' | 'Admin'
    paymentMethod: 'Wallet' | 'Razorpay',
    couponId: string,
}