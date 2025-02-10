import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import { AdminLoginRequestBody, AdminLoginReturnType,AdminUpdateUserRequestBody,AdminUpdateUserReturnType,AdminUpdateUserOrderRequestBody,AdminUpdateUserOrderReturnType, AdminMailUsersRequestBody, AdminMailUsersReturnType } from "../Types/Admin";
import { AdminLoginReqBody,AdminUpdateUserDataReqBody,MailUserReqBody,UpdateUserOrdersZodSchema } from "../Schemas/zod/Admin.zod";
import { ProductReqBodyReturnType, ProductReqBodyType, UpdateProductReqBodyReturnType, UpdateProductReqBodyType } from "../Types/product";
import { ProductZodSchema,UpdateProductZodSchema } from "../Schemas/zod/product.zod";


function handleZodError<T>(err: z.ZodError): { success: boolean; data: T } {
    const validationError = fromZodError(err);
    const errorObject = validationError.details.reduce((acc: Record<string, any>, error) => { acc[error.path.join('.')] = error.message; return acc; }, {});
    const AdminInputErrors = { success: false, data: errorObject as T, };
    return AdminInputErrors;
}

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
                const zError = handleZodError(err) as AdminLoginReturnType
                return zError
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
            
            const AdminInput: ProductReqBodyReturnType|UpdateProductReqBodyReturnType = {
                success: true,
                data: Data
            }
            return AdminInput
        } catch (err) {
            if (err instanceof z.ZodError) {
                const AdminInputErrors =  handleZodError(err) as ProductReqBodyReturnType
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
                const AdminInputErrors = handleZodError(err) as AdminUpdateUserReturnType
                return AdminInputErrors
            }
            const AdminInputDefault: AdminUpdateUserReturnType = {
                success: false,
                data: {}
            }
            return AdminInputDefault
        }
    }
    validateAdminUpdateUserOrderDataInput(data: AdminUpdateUserOrderRequestBody): AdminUpdateUserOrderReturnType {
        try {
            const Data = UpdateUserOrdersZodSchema.parse(data);
            const AdminInput: AdminUpdateUserOrderReturnType = {
                success: true,
                data: Data
            }
            return AdminInput
        } catch (err) {
            if (err instanceof z.ZodError) {
                const AdminInputErrors = handleZodError(err) as AdminUpdateUserOrderReturnType
                return AdminInputErrors
            }
            const AdminInputDefault: AdminUpdateUserOrderReturnType = {
                success: false,
                data: {}
            }
            return AdminInputDefault
        }
    }
    validateAdminMailUserInput(data: AdminMailUsersRequestBody): AdminMailUsersReturnType {
        try {
            const Data = MailUserReqBody.parse(data);
            const AdminInput: AdminMailUsersReturnType = {
                success: true,
                data: Data
            }
            return AdminInput
        } catch (err) {
            if (err instanceof z.ZodError) {
                const AdminInputErrors = handleZodError(err) as AdminMailUsersReturnType
                return AdminInputErrors
            }
            const AdminInputDefault: AdminMailUsersReturnType = {
                success: false,
                data: {
                    Type: "toOne",
                    Subject:"",
                    Message:""
                }
            }
            return AdminInputDefault
        }
    }

}