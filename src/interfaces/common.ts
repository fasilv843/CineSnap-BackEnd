
export type Location = [number, number];

export interface ITheaterAddress {
    country: string
    state: string
    district: string
    city: string
    zip: number
    landmark?: string
}

export interface IUserAddress {
    country: string
    state: string
    district: string
    city: string
    zip: number
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