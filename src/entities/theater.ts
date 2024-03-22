import { ICoords, ITheaterAddress, IWalletHistory } from "./common"

export interface ITheater {
    _id: string
    name: string
    email: string
    mobile?: number
    password: string
    isBlocked: boolean
    profilePic?: string
    liscenceId: string
    screenCount: number
    wallet: number
    walletHistory: IWalletHistory[]
    isGoogleAuth: boolean
    coords: ICoords
    address: ITheaterAddress,
    socialMediaHandles?: Map<string, string>
    approvalStatus: string
}