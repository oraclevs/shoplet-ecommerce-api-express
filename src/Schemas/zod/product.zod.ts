import { z } from 'zod'




export const ProductZodSchema = z.object({
    name: z.string(),
    description: z.string(), 
    brand: z.string(),
    price: z.number(),
    category: z.string(),
    stock_quantity: z.number(),
    attributes: z.object({
        size: z.array(z.string()),
        color: z.array(z.string()),
        material:z.array(z.string()),
    })
})
export const UpdateProductZodSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(), 
    brand: z.string().optional(),
    price: z.number().optional(),
    category: z.string().optional(),
    stock_quantity: z.number().optional(),
    attributes: z.object({
        size: z.array(z.string()).optional(),
        color: z.array(z.string()).optional(),
        material:z.array(z.string()).optional(),
    }).optional(),
})
