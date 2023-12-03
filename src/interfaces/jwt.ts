import { ID } from "./common";

export interface JWT {
    generateAccessToken(id: ID): string
    generateRefreshToken(id: ID): string
}