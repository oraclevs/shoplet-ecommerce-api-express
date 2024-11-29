import { AdminLoginReqBody } from "../Schemas/zod/Admin.zod";
import { z } from 'zod'


export type AdminLoginRequestBody = z.infer<typeof AdminLoginReqBody>
export type AdminLoginReturnType = {
    success: boolean,
    data: AdminLoginRequestBody,
}

