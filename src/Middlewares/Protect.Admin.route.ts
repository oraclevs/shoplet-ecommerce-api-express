import { isTokenValid, GetToken } from "./Protect.User.route";
import { CustomRequest, CustomResponse, JwtPayloadType } from "../Types/Main";
import { NextFunction } from "express-serve-static-core";
import { JwtToken } from "../Utils/Token";
import { JwtPayload } from "jsonwebtoken";
import { Admin } from "../Schemas/mongoose/Admin.Schema";


export async function GenerateRefreshTokenForAdmin(req: CustomRequest, res: CustomResponse, next: NextFunction) {
    try {
        const Token: string = GetToken(req, res, next);
        const { IsValidToken } = isTokenValid(req, res, next, Token)
        if (!IsValidToken) {
            interface MyPayLoad extends JwtPayload, JwtPayloadType { }
            const DecodedToken = new JwtToken().decode(Token) as MyPayLoad
            if (!DecodedToken || !DecodedToken.Data || !DecodedToken.Data.UserId) {
                throw new TypeError('Invalid token data');
            }
            if (DecodedToken.Type === 'AccessToken') {
                if (DecodedToken.Role === 'Admin') {
                    const TokenFromDB = await Admin.findById(DecodedToken.Data.UserId, { AuthToken: 1, _id: 0 })
                    const RefreshToken = TokenFromDB?.AuthToken as string
                    const { IsValidToken } = isTokenValid(req, res, next, RefreshToken)
                    if (IsValidToken) {
                        const AccessToken = new JwtToken().Sign({ Type: 'AccessToken', Data: { UserId: DecodedToken.Data.UserId }, Role: 'Admin' }, process.env.ACCESS_TOKEN_EXPIRE_TIME as string)
                        res.status(200).json({ AccessToken })
                    } else {
                        throw { error: "Unauthorized Invalid Token" }
                    }
                } else {
                    throw new Error('Invalid AccessToken')
                }
            }
        } else {
            res.status(200).json({ msg: "AccessToken is still valid" })
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ error: error.message })
        } else {
            res.status(401).json({ error })
        }
    }
}




//  Middleware ware  function that sits between the the route and the controller to protect the route
export async function ProtectAdminRoutes(req: CustomRequest, res: CustomResponse, next: NextFunction) {
    try {
        const Token: string = GetToken(req, res, next);
        const { IsValidToken } = isTokenValid(req, res, next, Token)
        interface MyPayLoad extends JwtPayload, JwtPayloadType { }
        const DecodedToken = new JwtToken().decode(Token) as MyPayLoad
        if (IsValidToken && DecodedToken.Type === 'AccessToken') {
            if (DecodedToken.Role === 'Admin') {
                req.AdminID = DecodedToken.Data.UserId
                next()
            } else {
                res.status(401).json({ error: "Invalid token" })
                return
            }
        } else {
            res.status(401).json({ error: "Unauthorized, invalid token" })
            return
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ error: error.message })
        } else {
            res.status(401).json({ error })
        }
    }
}