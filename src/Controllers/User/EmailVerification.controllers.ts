import { CustomRequest, CustomResponse } from "../../Types/Main";
import { VerificationCode } from "../../Schemas/mongoose/EmailVerification.schema";
import { User } from "../../Schemas/mongoose/User.schema";
import { EmailSender } from "../../Email/SendMail";
import { UserAuthInputValidator } from "../../Utils/UserInputValidators";



// Generate Save Verification Code to database
export async function generateAndSaveVerificationCode(userId: string) {
    const code: number = Math.floor(100000 + Math.random() * 900000);
    const verificationCode = new VerificationCode({ code, userId });
    await verificationCode.save();
    return code;
}


export const GetNewVerificationCode = async (req: CustomRequest, res: CustomResponse) => {
    try {
        const UserID = req.UserID as string
        
        const UserEmailFromDB = await User.findById(UserID, { Email: 1, _id: 0, FullName: 1 })
       
        const Email = UserEmailFromDB?.Email as string
        const UserName = UserEmailFromDB?.FullName as string
        const Code = await generateAndSaveVerificationCode(UserID)
        const EmailDetails = { Receiver: Email, Subject: "Email verification 📧", UserName, Code }
        await new EmailSender().ActivationEmail(EmailDetails)
        res.status(200).json({ success: true, msg: "Verification code has been sent to your email" })
    } catch (error) {
        
        res.status(500).json({ success: false, msg: error })
    }
}
export const VerifyEmail = async (req: CustomRequest, res: CustomResponse) => {
    try {
        const UserID = req.UserID as string
        const Data = new UserAuthInputValidator().EmailVerificationInput(req.body.Code)
        
        if (!Data.success) {
            throw Data.ErrorMessage
        }
        const UserCodeFromDB = await VerificationCode.findOne({ userId: UserID }, { code: 1, _id: 0 })
        
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