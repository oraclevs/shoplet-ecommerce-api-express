import { Request,Response, } from "express-serve-static-core";


export type JwtPayloadType = {
    Type: 'AccessToken' | 'RefreshToken',
    Role:'User'|'Admin'
    Data: { UserId: string }
    Blocked?: boolean;
}

export interface CustomRequest extends Request {
    UserID?: string;
    rawBody?: Buffer;
    AdminID?: string;
}
export interface CustomResponse extends Response {}