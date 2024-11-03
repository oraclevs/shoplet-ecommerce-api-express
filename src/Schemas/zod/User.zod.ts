import { z } from 'zod'




export const RegisterRequestBody = z.object({
    FullName: z.string().min(5, 'Your Full Name Should be at Least 5 characters'),
    Email: z.string().min(1, 'This email field is required').email('Input a valid email address'),
    Password: z.string().min(8, 'Your Password Should be at least 8 characters')
})
export const LoginRequestBody = z.object({
    Email: z.string().min(1, 'This email field is required').email('Input a valid email address'),
    Password: z.string().min(8, 'Your Password Should be at least 8 characters')
})

export const EmailValidationRequestBody = z.object({
    Code: z.number().refine((val) => val.toString().length === 6, {
        message: "Must be a six-digit number",
    })

})

