import { Admin } from "../../Schemas/mongoose/Admin.Schema";
import { CustomRequest, CustomResponse } from "../../Types/Main";
import { PasswordSecure } from "../../Utils/HashPassword";
import { JwtToken } from "../../Utils/Token";
import { AdminInputValidator } from './../../Utils/AdminInputValidators';


export const AdminLogin = async(req:CustomRequest,res:CustomResponse) => {
    try {
        const { REFRESH_TOKEN_EXPIRE_TIME, ACCESS_TOKEN_EXPIRE_TIME } = process.env
        // Validate the data from the request body
        const ReqData = new AdminInputValidator().validateLoginInput(req.body)
        if (!ReqData.success) {
            throw ReqData.data
        }
        // find the admin data in the database with the provided email address from request body 
        const admin = await Admin.findOne({ Email: ReqData.data.Email }, { Email: 1, Password: 1,_id:1 })
        if (!admin) { 
            res.status(401).json({ msg: "Invalid Credentials" })
            return
        }
        
        // check if the provided password is correct
        const IsPasswordCorrect = await new PasswordSecure().ComparePassWord(ReqData.data.Password, admin.Password)
        
        if (!IsPasswordCorrect) { 
            res.status(401).json({ msg: "Invalid Credentials" })
            return
        }
        const UserId = admin._id.toString()
        // create a request token and a refresh token
        const RefreshToken = new JwtToken().Sign({ Type: 'RefreshToken', Data: { UserId }, Role: 'Admin' }, REFRESH_TOKEN_EXPIRE_TIME as string)
        await Admin.findByIdAndUpdate(admin._id, { AuthToken: RefreshToken })
        const AccessToken = new JwtToken().Sign({ Type: 'AccessToken', Data: { UserId }, Role: 'Admin' }, ACCESS_TOKEN_EXPIRE_TIME as string)

        res.status(200).json({ success: true , AccessToken});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({error: error.message});   
        } else {
            res.status(500).json({error});   
        }
    }
}