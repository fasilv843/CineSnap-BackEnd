import { IAddress, IWalletHistory, ICoords } from "./common"


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
    coords?: ICoords
    address: IAddress
}