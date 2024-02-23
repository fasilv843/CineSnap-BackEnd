export interface ITokenGenerator {
    generateAccessToken(id: string): string
    generateRefreshToken(id: string): string
}