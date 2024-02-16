export interface IUserAddress {
    country: string
    state: string
    district: string
    city: string
    zip: number
}

export interface ITheaterAddress extends IUserAddress {
    landmark?: string
}

export interface IWalletHistory {
    amount: number
    message: string
    date: Date
}

export interface ICoords {
    type: 'Point'
    coordinates: [number, number];
}