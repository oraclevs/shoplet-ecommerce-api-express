import { Request,Response } from "express-serve-static-core";


export type JwtPayloadType = {
    Type: 'AccessToken' | 'RefreshToken',
    Data: { UserId: string }
}

export interface CustomRequest extends Request { UserID?: string; }
export interface CustomResponse extends Response {}