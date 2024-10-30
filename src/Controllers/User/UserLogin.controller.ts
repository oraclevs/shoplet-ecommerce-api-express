import { Request, Response } from "express-serve-static-core";
import { UserLoginRequestBody } from "../../Types/User";
import { UserAuthInputValidator } from "../../Utils/AuthUserInputValidators";
import { User } from "../../Schemas/mongoose/User.schema";
import { PasswordSecure } from "../../Utils/HashPassword";
import { JwtToken } from "../../Utils/Token";



export const LoginUser = async (req: Request<{}, {}, UserLoginRequestBody>, res: Response) => {
    try {
        // validating user input from req.body
        const { success, data } = new UserAuthInputValidator().validateLoginInput(req.body)
        if (!success) {
            throw data
        }
        const UserFromDb = await User.findOne({ Email: data.Email }, { Email: 1, Password: 1, _id: 1 })
        console.log(UserFromDb, 'user from db')
        if (!UserFromDb?.Email) {
            res.status(401).json({ error: "Invalid Email or Password" })
        }
        // checking if the password is correct. if its correct we give the user a new access and refresh token else we throw an error  back to the users face.
        const IsPasswordCorrect = await new PasswordSecure().ComparePassWord(data.Password, UserFromDb?.Password as string)
        console.log('is password correct', IsPasswordCorrect)
        if (IsPasswordCorrect) {
            const UserId = UserFromDb?._id.toString() as string
            // Creating the Access and Refresh Token
            const RefreshToken = new JwtToken().Sign({ Type: 'RefreshToken', Data: { UserId } }, "300s")
            await User.findByIdAndUpdate(UserId, { AuthToken: RefreshToken })
            const AccessToken = new JwtToken().Sign({ Type: 'AccessToken', Data: { UserId } }, "120s")
            console.log(RefreshToken, AccessToken)
            // sending email to the user to notify the someone has successfully has access to  there account
            res.status(200).json({ msg: 'User Login Successful', AccessToken })
        } else {
            res.status(401).json({ error: "Invalid Email or  password" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}