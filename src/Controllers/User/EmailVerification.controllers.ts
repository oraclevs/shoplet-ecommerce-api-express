import { Request, Response } from "express-serve-static-core";
import { VerificationCode } from "../../Schemas/mongoose/EmailVerification.schema";
import { User } from "../../Schemas/mongoose/User.schema";
import { EmailSender } from "../../Email/SendMail";
import { UserAuthInputValidator } from "../../Utils/AuthUserInputValidators";



// Generate Save Verification Code to database
export async function generateAndSaveVerificationCode(userId: string) {
    const code: number = Math.floor(100000 + Math.random() * 900000);
    const verificationCode = new VerificationCode({ code, userId });
    await verificationCode.save();
    return code;
}


export const GetNewVerificationCode = async (req: Request, res: Response) => {
    try {
        const UserID = req.body.UserID as string
        console.log(UserID)
        const UserEmailFromDB = await User.findById(UserID, { Email: 1, _id: 0, FullName: 1 })
        console.log(UserEmailFromDB)
        const Email = UserEmailFromDB?.Email as string
        const UserName = UserEmailFromDB?.FullName as string
        const Code = await generateAndSaveVerificationCode(UserID)
        const EmailDetails = { Receiver: Email, Subject: "Email verification 📧", UserName, Code }
        await new EmailSender().ActivationEmail(EmailDetails)
        res.status(200).json({ success: true, msg: "Verification code has been sent to your email" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, msg: error })
    }
}
export const VerifyEmail = async (req: Request, res: Response) => {
    try {
        const UserID = req.body.UserID as string
        const Data = new UserAuthInputValidator().EmailVerificationInput(req.body.Code)
        console.log(UserID, Data)
        if (!Data.success) {
            throw Data.ErrorMessage
        }
        const UserCodeFromDB = await VerificationCode.findOne({ userId: UserID }, { code: 1, _id: 0 })
        console.log(UserCodeFromDB)
        if (UserCodeFromDB === null) {
            res.status(401).json({ success: false, msg: "Verification code has expired. Request a new verification code. " })
            return
        }
        const CodeFromDb: number = UserCodeFromDB?.code as number
        if (CodeFromDb === Data.CodeFromUser) {
            await User.findByIdAndUpdate(UserID, { IsEmailVerified: true })
            res.status(200).json({ success: true, msg: "Email has been successfully verified" })
        } else {
            res.status(401).json({ success: false, msg: "Verification code has expired. Request a new verification code.  " })
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message })
        } else {
            res.status(500).json({ error })
        }
    }
}