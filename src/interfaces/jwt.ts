export interface JWT {
    generateAccessToken(id: string): string
    generateRefreshToken(id: string): string
}