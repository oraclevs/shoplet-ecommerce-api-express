import { Request, Response } from "express-serve-static-core";
import { UserRegisterRequestBody } from "../../Types/User";
import { UserAuthInputValidator } from "../../Utils/AuthUserInputValidators";
import { User } from "../../Schemas/mongoose/User.schema";
import { PasswordSecure } from "../../Utils/HashPassword";
import { JwtToken } from "../../Utils/Token";
import { EmailSender } from "../../Email/SendMail";
import { generateAndSaveVerificationCode } from "./EmailVerification.controllers";






export const RegisterUser = async (req: Request<{}, {}, UserRegisterRequestBody>, res: Response) => {
    try {
        const { REFRESH_TOKEN_EXPIRE_TIME, ACCESS_TOKEN_EXPIRE_TIME } = process.env 
        // Validating User Input from req.body
        const { success, data } = new UserAuthInputValidator().validateRegisterInput(req.body);
        if (!success) {
            throw data
        }
        console.log(data, 'Data')
        // checking if user with the same email already exist in the database
        const user = await User.findOne({ Email: data.Email }, 'Email FullName ')
        // if we have a user with the email we return the error response
        if (user) {
            res.status(409).json({ error: { EmailDuplicate: 'Email already exists' } })
            return
        }
        // creating new user
        const HashedPassword = await new PasswordSecure().HashPassword(data.Password)
        console.log(HashedPassword, 'hashed password')
        const NewUser = new User({
            FullName: data.FullName,
            Email: data.Email,
            UserName: data.FullName.toLowerCase().trim(),
            Password: HashedPassword,
            CreatedAt: Date.now(),
            UpdatedAt: Date.now()
        })
        await NewUser.save()
        // getting the user id 
        const UserFromDB = await User.findOne({ Email: data.Email }, { _id: 1, FullName: 1,Email:1 })
        const UserId = UserFromDB?._id.toString() as string
        console.log(UserId, 'userId')
        //
        console.log(user)
        console.log(UserFromDB?.FullName)
        // Creating the Access and Refresh Token
        const RefreshToken = new JwtToken().Sign({ Type: 'RefreshToken', Data: { UserId } }, REFRESH_TOKEN_EXPIRE_TIME as string)
        await User.findByIdAndUpdate(UserId, { AuthToken: RefreshToken })
        const AccessToken = new JwtToken().Sign({ Type: 'AccessToken', Data: { UserId } }, ACCESS_TOKEN_EXPIRE_TIME as string)
        console.log(RefreshToken, AccessToken)
        //generate the Email verification code and save to the database
        const CodeFromDB = await generateAndSaveVerificationCode(UserId)
        //  send email verification and Welcome Email
        // email Details
        const Receiver = UserFromDB?.Email as string
        const Subject = "Welcome to Shoplet"
        const UserName = UserFromDB?.FullName as string
        const Code = CodeFromDB
        await new EmailSender().WelcomeEmail({ Receiver, Subject, UserName  })
        await new EmailSender().ActivationEmail({Receiver,Subject:"Email verification 📧",UserName,Code})
        res.status(201).json({ created: true, msg: 'new User created', AccessToken })
        return
    } catch (error) {
        console.error(error, 'error from controller')
        res.status(500).json({ error: error })
        return
    }
}


