import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import { AdminLoginRequestBody, AdminLoginReturnType,AdminUpdateUserRequestBody,AdminUpdateUserReturnType } from "../Types/Admin";
import { AdminLoginReqBody,AdminUpdateUserDataReqBody } from "../Schemas/zod/Admin.zod";
import { ProductReqBodyReturnType, ProductReqBodyType, UpdateProductReqBodyReturnType, UpdateProductReqBodyType } from "../Types/product";
import { ProductZodSchema,UpdateProductZodSchema } from "../Schemas/zod/product.zod";


export class AdminInputValidator {
    validateLoginInput(data: AdminLoginRequestBody): AdminLoginReturnType {
        try {
            const Data = AdminLoginReqBody.parse(data);
            const AdminInput: AdminLoginReturnType = {
                success: true,
                data: Data
            }
            return AdminInput
        } catch (err) {
            if (err instanceof z.ZodError) {
                const validationError = fromZodError(err);
                const errorObject = validationError.details.reduce((acc: Record<string, any>, error) => {
                    acc[error.path.join('.')] = error.message;
                    return acc;
                }, {});
                const AdminInputErrors: AdminLoginReturnType = {
                    success: false,
                    data: errorObject as AdminLoginRequestBody,
                }
                return AdminInputErrors
            }
            const AdminInputDefault: AdminLoginReturnType = {
                success: false,
                data: {
                    Email: "",
                    Password: "",
                }
            }
            return AdminInputDefault
        }
    }
    validateCreateProductInput(data: ProductReqBodyType|UpdateProductReqBodyType,For:"Add"|"Update"): ProductReqBodyReturnType|UpdateProductReqBodyReturnType {
        try {
            const Data = For === "Add" ? ProductZodSchema.parse(data) : UpdateProductZodSchema.parse(data);
            console.log(Data)
            const AdminInput: ProductReqBodyReturnType|UpdateProductReqBodyReturnType = {
                success: true,
                data: Data
            }
            return AdminInput
        } catch (err) {
            if (err instanceof z.ZodError) {
                const validationError = fromZodError(err);
                const errorObject = validationError.details.reduce((acc: Record<string, any>, error) => {
                    acc[error.path.join('.')] = error.message;
                    return acc;
                }, {});
                const AdminInputErrors: ProductReqBodyReturnType = {
                    success: false,
                    data: errorObject as ProductReqBodyType,
                }
                return AdminInputErrors
            }
            const AdminInputDefault: ProductReqBodyReturnType = {
                success: false,
                data: {
                    name: "",
                    description: "",
                    brand: "",
                    price: -1,
                    category: "",
                    stock_quantity: -1,
                    attributes: {
                        size: [""],
                        color: [""],
                        material: [""],
                    }
                }
            }
            return AdminInputDefault
        }
    }
    validateAdminUpdateUserDataInput(data: AdminUpdateUserRequestBody): AdminUpdateUserReturnType {
        try {
            const Data = AdminUpdateUserDataReqBody.parse(data);
            const AdminInput: AdminUpdateUserReturnType = {
                success: true,
                data: Data
            }
            return AdminInput
        } catch (err) {
            if (err instanceof z.ZodError) {
                const validationError = fromZodError(err);
                const errorObject = validationError.details.reduce((acc: Record<string, any>, error) => {
                    acc[error.path.join('.')] = error.message;
                    return acc;
                }, {});
                const AdminInputErrors: AdminUpdateUserReturnType = {
                    success: false,
                    data: errorObject as AdminUpdateUserRequestBody,
                }
                return AdminInputErrors
            }
            const AdminInputDefault: AdminUpdateUserReturnType = {
                success: false,
                data: {}
            }
            return AdminInputDefault
        }
    }
}