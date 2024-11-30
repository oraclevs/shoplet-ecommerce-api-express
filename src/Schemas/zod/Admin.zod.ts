import { z } from "zod";

export const AdminLoginReqBody = z.object({
    Email: z.string().email("Input a valid Email address"),
    Password: z.string().min(8,"Password must be at least 8 characters")
})

export const AdminUpdateUserDataReqBody = z.object({
    Blocked: z.object({
        Type: z.enum(["Permanently", "Temporary"]),
        IsBlocked:z.boolean(),
        Reason:z.string().min(6,"Please enter at least 6 characters"),
        Duration: z.object({
            from: z.date(),
            to:z.date(),
        })
    }).optional()
})