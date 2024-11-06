
import { fromZodError } from "zod-validation-error";
import { z } from 'zod'
import { RegisterReqBodyValidationReturnType, UserRegisterRequestBody,LoginReqBodyValidationReturnType,UserLoginRequestBody } from "../Types/User";
import { RegisterRequestBody, LoginRequestBody, EmailValidationRequestBody, AddressValidationRequestBody } from "../Schemas/zod/User.zod";
import { UserAddress } from './../Types/User';


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
    validateLoginInput(data: UserLoginRequestBody) {
        try {
              const Data = LoginRequestBody.parse(data);
            const UserInput: LoginReqBodyValidationReturnType = {
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
                const userInputErrors: LoginReqBodyValidationReturnType = {
                    success: false,
                    data: errorObject as UserLoginRequestBody,
                }
                return userInputErrors
            }
            const UserInputDefault: LoginReqBodyValidationReturnType = {
                success: false,
                data: {
                    Email: "",
                    Password: "",
                }
            }
            return UserInputDefault
        }
    }
    EmailVerificationInput(Code: number) {
        interface EmailValidationReturn{
            success: boolean,
            CodeFromUser: number,
            ErrorMessage?: object;
        }
        try {
            const Data = EmailValidationRequestBody.parse({ Code });
            const UserInput: EmailValidationReturn = {
                success: true,
                CodeFromUser: Data.Code
            }
            return UserInput
        } catch (err) {
            if (err instanceof z.ZodError) {
                const validationError = fromZodError(err);
                const errorObject = validationError.details.reduce((acc: Record<string, any>, error) => {
                    acc[error.path.join('.')] = error.message;
                    return acc;
                }, {});
                const userInputErrors: EmailValidationReturn = {
                    success: false,
                    CodeFromUser: -1,
                    ErrorMessage: errorObject
                }
                return userInputErrors
            }
            const UserInputDefault: EmailValidationReturn = {
                success: false,
                CodeFromUser:-1
            }
            return UserInputDefault
        }
    }
    UserAddressValidation(Address: UserAddress) {
        interface UserAddressValidationReturn {
            Success: boolean,
            data: UserAddress
       }
        try {
            const Data = AddressValidationRequestBody.parse(Address);
            const UserInput: UserAddressValidationReturn  = {
                Success: true,
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
                const userInputErrors:UserAddressValidationReturn  = {
                    Success: false,
                    data: errorObject  as UserAddress
                }
                return userInputErrors
            }
            const UserInputDefault:UserAddressValidationReturn  = {
                Success: false,
                data: {
                    Address: "",
                    Country: "",
                    State: "",
                    ZipCode: "",
                }
            }
            return UserInputDefault
        }
    }

}

