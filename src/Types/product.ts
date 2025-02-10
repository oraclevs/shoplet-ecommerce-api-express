import { ProductZodSchema,UpdateProductZodSchema } from "../Schemas/zod/product.zod";
import { z } from 'zod'


export type ProductReqBodyType = z.infer<typeof ProductZodSchema>
export type ProductReqBodyReturnType = {
    success: boolean,
    data:ProductReqBodyType
}

export type UpdateProductReqBodyType = z.infer<typeof UpdateProductZodSchema>
export type UpdateProductReqBodyReturnType = {
    success: boolean,
    data:UpdateProductReqBodyType
}