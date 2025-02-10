import {  z } from "zod";

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


export const UpdateUserOrdersZodSchema = z.object({
    // OrderId:z.string(),
    PaymentSuccessful: z.boolean().optional(),
    Shipped: z.boolean().optional(),
    Received: z.boolean().optional(),
    Delivered:z.boolean().optional(),
    ShippingDetails: z.object({
        address: z.object({
            city: z.string(),
            country: z.string(),
            line1: z.string(),
            line2: z.string(),
            postal_code: z.string(),
            state: z.string(),
        }).optional(),
        name:z.string().optional(),
    }).optional()
})

export const MailUserReqBody = z.object({
    Type: z.enum(['toOne', 'toMany','toAll']),
    Subject:z.string(),
    UserId: z.string().optional(),
    ListOfUserIds: z.array(z.string()).optional(),
    Message: z.string(),
})
