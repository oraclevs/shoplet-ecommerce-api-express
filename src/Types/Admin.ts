import { AdminLoginReqBody,AdminUpdateUserDataReqBody } from "../Schemas/zod/Admin.zod";
import { z } from 'zod'


export type AdminLoginRequestBody = z.infer<typeof AdminLoginReqBody>
export type AdminLoginReturnType = {
    success: boolean,
    data: AdminLoginRequestBody,
}

export type AdminUpdateUserRequestBody = z.infer<typeof AdminUpdateUserDataReqBody>
export type AdminUpdateUserReturnType = {
    success: boolean,
    data: AdminUpdateUserRequestBody,
}


