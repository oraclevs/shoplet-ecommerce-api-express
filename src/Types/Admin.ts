import { AdminLoginReqBody,AdminUpdateUserDataReqBody,UpdateUserOrdersZodSchema,MailUserReqBody } from "../Schemas/zod/Admin.zod";
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

export type AdminUpdateUserOrderRequestBody = z.infer<typeof UpdateUserOrdersZodSchema>
export type AdminUpdateUserOrderReturnType = {
    success: boolean,
    data: AdminUpdateUserOrderRequestBody,
}


export type AdminMailUsersRequestBody = z.infer<typeof MailUserReqBody>
export type AdminMailUsersReturnType = {
    success: boolean,
    data: AdminMailUsersRequestBody,
}



