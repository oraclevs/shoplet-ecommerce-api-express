import { User } from "../../Schemas/mongoose/User.schema";
import { CustomRequest, CustomResponse } from "../../Types/Main";
import { UserAddress } from "../../Types/User";
import { UserAuthInputValidator } from './../../Utils/AuthUserInputValidators';



export const UpdateUserProfileDetails = async (req: CustomRequest, res: CustomResponse) => {
    const update: { $push?: { Address: UserAddress }, PhoneNumber?: string } = {}
    try {
        if (req.body.Address) {
            const { Success, data } = new UserAuthInputValidator().UserAddressValidation(req.body.Address)
            if (Success) {
                update.$push = { Address: data }
            } else {
                throw data
            }
        }
        if (req.body.PhoneNumber) {
            update.PhoneNumber = req.body.PhoneNumber
        }
        await User.findByIdAndUpdate(req.UserID, update, { new: true })
        res.status(200).json({ success: true, update });

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message })
        } else {
            res.status(500).json({ error })
        }
    }
}