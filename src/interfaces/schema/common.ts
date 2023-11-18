
export type Location = [number, number];

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

export interface ICoords {
    type?: string
    coordinates: [number, number];
}