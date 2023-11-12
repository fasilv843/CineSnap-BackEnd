import { IAddress, ILocation, IWalletHistory } from "./common"


export interface ITheater {
    _id?: string
    name: string
    email: string
    mobile?: number
    password: string
    isBlocked?: boolean
    profilePic?: string
    liscenceId: string
    wallet?: number | null
    walletHistory?: IWalletHistory
    coords?: ILocation
    address: IAddress
}