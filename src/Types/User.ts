import { LoginRequestBody, RegisterRequestBody,UserCheckoutRequestBody } from "../Schemas/zod/User.zod";
import { z } from 'zod'




export type UserRegisterRequestBody = z.infer<typeof RegisterRequestBody>
export type UserLoginRequestBody = z.infer<typeof LoginRequestBody>

export type RegisterReqBodyValidationReturnType = {
    success: boolean,
    data: UserRegisterRequestBody
}
export type LoginReqBodyValidationReturnType = {
    success: boolean,
    data: UserLoginRequestBody
}
export interface UserAddress {
    Address: string;
    Country: string;
    State: string;
    ZipCode: string;
}

export type UserCheckoutType =  z.infer<typeof UserCheckoutRequestBody>