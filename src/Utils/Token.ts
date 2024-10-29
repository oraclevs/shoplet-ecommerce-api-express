import  Jwt  from "jsonwebtoken";
import { JwtPayloadType } from "../Types/Main";



export class JwtToken{
    private SecretKey = process.env.JWT_SECRET_KEY as string
    Sign(Payload: JwtPayloadType,  Expire: string) {
        const Token = Jwt.sign(Payload, this.SecretKey, { algorithm: 'HS256', expiresIn: Expire })
        return Token
    }
    verify(Token:string) {
        const IsTokenValid = Jwt.verify(Token, this.SecretKey)
        return IsTokenValid
    }
}
