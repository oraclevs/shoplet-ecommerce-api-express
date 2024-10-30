import { NextFunction, Request, Response } from "express-serve-static-core";
import { JwtToken } from "../Utils/Token";
import { JwtPayload } from "jsonwebtoken";
import { JwtPayloadType } from "../Types/Main";
import { User } from "../Schemas/mongoose/User.schema";







// get user token from the header 
function GetToken(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const Token = authorizationHeader.substring(7);
        console.log(Token, 'from get token')
        return Token
    }
    else {
        throw new Error('no token found in Headers')
    }
}

// check if  the token is valid
function isTokenValid(req: Request, res: Response, next: NextFunction, Token: string) {
    try {
        console.log(Token)
        const IsValidToken = new JwtToken().verify(Token)
        console.log(IsValidToken, 'Token from middleware')
        return { IsValidToken: true }
    } catch (err) {
        return { IsValidToken: false }
    }
}
// get a new Access token for the user if the reference token is valid
export async function GenerateRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const Token: string = GetToken(req, res, next);
        const { IsValidToken } = isTokenValid(req, res, next, Token)
        if (!IsValidToken) {
            interface MyPayLoad extends JwtPayload, JwtPayloadType { }
            const DecodedToken = new JwtToken().decode(Token) as MyPayLoad
            console.log(DecodedToken.Type)
            if (!DecodedToken || !DecodedToken.Data || !DecodedToken.Data.UserId) {
                console.log('DecodedToken null or empty')
                throw new TypeError('Invalid token data');
            }
            if (DecodedToken.Type === 'AccessToken') {
                const TokenFromDB = await User.findById(DecodedToken.Data.UserId, { AuthToken: 1, _id: 0 })
                const RefreshToken = TokenFromDB?.AuthToken as string
                console.log(RefreshToken, 'Token from DB')
                const { IsValidToken } = isTokenValid(req, res, next, RefreshToken)
                if (IsValidToken) {
                    const AccessToken =  new JwtToken().Sign({ Type: 'AccessToken', Data: { UserId: DecodedToken.Data.UserId } }, "120s")
                    res.status(200).json({ AccessToken })
                } else {
                    throw { error: "Unauthorized Invalid Token" }
                }
            }
        } else {
            res.status(200).json({msg:"AccessToken is still valid"})
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error, 'from error l')
            res.status(401).json({ error: error.message })
        } else {
            res.status(401).json({ error })
        }
    }
}



//  Middleware ware  function that sits between the the route and the controller to protect the route
export async function ProtectUserRoutes(req: Request, res: Response, next: NextFunction) {
    try {
        const Token: string = GetToken(req, res, next);
        const { IsValidToken } = isTokenValid(req, res, next, Token)
        if (IsValidToken) {
            next()
        } else {
            interface MyPayLoad extends JwtPayload, JwtPayloadType { }
            const DecodedToken = new JwtToken().decode(Token) as MyPayLoad
            console.log(DecodedToken)
            if (DecodedToken.Type === 'AccessToken') {
                res.status(401).json({ error: "Unauthorized invalid token" })
            }
        }
    } catch (error) {
        res.status(500).send({ error })
    }
}

// controller and Middleware to logout the user
export async function LogoutUser(req:Request,res:Response,next:NextFunction) {
    try {
        const Token: string = GetToken(req, res, next);
        const { IsValidToken } = isTokenValid(req, res, next, Token)
        if (!IsValidToken) {
            res.status(401).json({error: 'Invalid Token'})
        }
        interface MyPayLoad extends JwtPayload, JwtPayloadType { }
        const DecodedToken = new JwtToken().decode(Token) as MyPayLoad
        console.log(DecodedToken)
        if (DecodedToken.Type != 'AccessToken') {
            res.status(401).json({ error: 'Invalid Token' })
        }
        // removing the save token from the Database
        await User.findByIdAndUpdate(DecodedToken.Data.UserId, { AuthToken: " " })
        res.status(200).json({msg:'User is successfully Logged out'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}




