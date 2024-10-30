


export type JwtPayloadType = {
    Type: 'AccessToken' | 'RefreshToken',
    Data: { UserId: string }
}