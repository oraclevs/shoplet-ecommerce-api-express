import { z } from "zod";

export const AdminLoginReqBody = z.object({
    Email: z.string().email("Input a valid Email address"),
    Password: z.string().min(8,"Password must be at least 8 characters")
})