import { RegisterRequestBody } from "../Schemas/zod/User.zod";
import { z } from 'zod'




export type UserRegisterRequestBody = z.infer<typeof RegisterRequestBody>
export type RegisterReqBodyValidationReturnType = {
    success: boolean,
    data: UserRegisterRequestBody
}
