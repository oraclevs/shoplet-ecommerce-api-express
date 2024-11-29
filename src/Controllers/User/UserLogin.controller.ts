import { Request, Response } from "express-serve-static-core";
import { UserLoginRequestBody } from "../../Types/User";
import { UserAuthInputValidator } from "../../Utils/UserInputValidators";
import { User } from "../../Schemas/mongoose/User.schema";
import { PasswordSecure } from "../../Utils/HashPassword";
import { JwtToken } from "../../Utils/Token";
// import { EmailSender } from "../../Email/SendMail";
// import { getLoginLocation } from "../../Utils/User_Ip_Details";





export const LoginUser = async (req: Request<{}, {}, UserLoginRequestBody>, res: Response) => {
    const { REFRESH_TOKEN_EXPIRE_TIME, ACCESS_TOKEN_EXPIRE_TIME } = process.env
    try {
        // validating user input from req.body
        const { success, data } = new UserAuthInputValidator().validateLoginInput(req.body)
        if (!success) {
            throw data
        }
        const UserFromDb = await User.findOne({ Email: data.Email }, { Email: 1, Password: 1, _id: 1, FullName: 1 })
        if (!UserFromDb?.Email) {
            res.status(401).json({ error: "Invalid Email or Password" })
        }
        // checking if the password is correct. if its correct we give the user a new access and refresh token else we throw an error  back to the users face.
        const IsPasswordCorrect = await new PasswordSecure().ComparePassWord(data.Password, UserFromDb?.Password as string)
        if (IsPasswordCorrect) {
            const UserId = UserFromDb?._id.toString() as string
            // const FullName = UserFromDb?.FullName as string
            // const Email = UserFromDb?.Email as string
            // Creating the Access and Refresh Token
            const RefreshToken = new JwtToken().Sign({ Type: 'RefreshToken', Data: { UserId },Role:'User' }, REFRESH_TOKEN_EXPIRE_TIME as string)
            await User.findByIdAndUpdate(UserId, { AuthToken: RefreshToken })
            const AccessToken = new JwtToken().Sign({ Type: 'AccessToken', Data: { UserId },Role:'User' }, ACCESS_TOKEN_EXPIRE_TIME as string)
            // sending email to the user to notify the someone has successfully has access to  there account
            // const loginDetails = await getLoginLocation(req);
            // console.log('Login Info:', loginDetails);
            // const Message = `
            //     Hi ${FullName},
            //     We noticed a new login to your Shoplet account just now.

            //     Login Details:

            //     Date & Time:{loginDetails.dateTime}

            //     Location: {loginDetails.location}

            //     Device: {loginDetails.device}

            //     If this was you, no further action is needed.

            //     If you didn't log in, please reset your password immediately or contact our support team at Customer Support Email.

            //     Stay secure, The Shoplet Team`

            // await new EmailSender().LoginEmail({ Receiver: Email, Subject: "Login Detected", UserName: UserFromDb?.FullName as string,Message })
            res.status(200).json({ msg: 'User Login Successful', AccessToken })
        } else {
            res.status(401).json({ error: "Invalid Email or  password" })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}