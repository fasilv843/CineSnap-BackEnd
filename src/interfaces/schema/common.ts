export interface ILocation {
    longitude: number
    latitude: number
}

export interface IAddress {
    country: string
    state: string
    district: string
    city: string
    zip: number
    landmark?: string
}

export interface IWalletHistory {
    amount: number
    message: string
    date: Date
}