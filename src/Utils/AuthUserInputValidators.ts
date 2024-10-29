
import { fromZodError } from "zod-validation-error";
import { z } from 'zod'
import { RegisterReqBodyValidationReturnType, UserRegisterRequestBody } from "../Types/User";
import { RegisterRequestBody } from "../Schemas/zod/User.zod";


export class UserAuthInputValidator{
    validateRegisterInput(data: UserRegisterRequestBody): RegisterReqBodyValidationReturnType {
        try {
            const Data = RegisterRequestBody.parse(data);
            const UserInput: RegisterReqBodyValidationReturnType = {
                success: true,
                data: Data
            }
            return UserInput
        } catch (err) {
            if (err instanceof z.ZodError) {
                const validationError = fromZodError(err);
                const errorObject = validationError.details.reduce((acc: Record<string, any>, error) => {
                    acc[error.path.join('.')] = error.message;
                    return acc;
                }, {});
                const userInputErrors: RegisterReqBodyValidationReturnType = {
                    success: false,
                    data: errorObject as UserRegisterRequestBody,
                }
                return userInputErrors
            }
            const UserInputDefault: RegisterReqBodyValidationReturnType = {
                success: false,
                data: {
                    FullName: "",
                    Email: "",
                    Password: "",
                }
            }
            return UserInputDefault
        }
    }
    validateLoginInput() {
        
    }
}