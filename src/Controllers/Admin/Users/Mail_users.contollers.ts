import { EmailSender } from "../../../Email/SendMail";
import { User } from "../../../Schemas/mongoose/User.schema";
import { CustomRequest, CustomResponse } from "../../../Types/Main";
import { AdminInputValidator } from "../../../Utils/AdminInputValidators";
import { ValidateObject_id } from "../../../Utils/ValidateObject_Id";



export const MailUser = async (req: CustomRequest, res: CustomResponse) => {
    try {
        // check if the User Id is present and valid
        if (req.body.UserId) {
            ValidateObject_id(req, res, {
                ErrorMessage: "Invalid User ID",
                ID: req.body.UserId,
                From: "Custom"
            });
        }
        (req.body)
        // validate the request body from user
        const { success, data } = new AdminInputValidator().validateAdminMailUserInput(req.body);
        if (!success) {
            throw data
        }
        if (data.Type === 'toOne' && data.UserId === undefined) {
            res.status(401).json({ error: "For type 'toOne' UserId is required" })
            return
        } else if (data.Type === 'toMany' && data.ListOfUserIds === undefined) {
            res.status(401).json({ error: "For type 'toMany' ListOfUserIds is required" })
            return
        }
        // send mail to user
        if (data.Type === "toOne") {
            const user = await User.findById(data.UserId, { Email: 1, FullName: 1 })
            if (!user) {
                res.status(401).json({ error: "No User found with ID" })
                return
            }
            (user)
            await new EmailSender().CustomEmail({
                Receiver: user.Email,
                UserName: user.FullName,
                Subject: data.Subject,
                Message: data.Message
            })
            res.status(200).json({ success: true, msg: "Email sent successfully" });
            return
        } else if (data.Type === 'toMany' && data.ListOfUserIds != undefined) {
            const UsersFromDB = []
            const ListOfUserNotFound = []
            for (const userID of data.ListOfUserIds) {
                
                const user = await User.findById(userID, { Email: 1, FullName: 1 })
                if (!user) {
                    ListOfUserNotFound.push(userID)
                } else if (user) {
                    UsersFromDB.push(user)
                }
            }
            if (UsersFromDB.length <= 0) {
                res.status(404).json({
                    error: "No users found",
                    ListOfUserIds: ListOfUserNotFound
                })
                return
            }
            for (const User of UsersFromDB) {
                await new EmailSender().CustomEmail({
                    Receiver: User.Email,
                    UserName: User.FullName,
                    Subject: data.Subject,
                    Message: data.Message,
                })
            }
            res.status(200).json({ success: true, ListOfUserNotFound })
            return
        }
        if (data.Type === 'toAll') {
            const Users = await User.find({}, { Email: 1, FullName: 1 })
            for (const User of Users) {
                await new EmailSender().CustomEmail({
                    Receiver: User.Email,
                    UserName: User.FullName,
                    Subject: data.Subject,
                    Message: data.Message,
                })
            }
            res.status(200).json({ success: true, msg: "Email sent successfully to All Users" });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error });
        }
    }
}