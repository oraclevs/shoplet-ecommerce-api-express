import { UsersCart } from "../../../Schemas/mongoose/Cart.schema"
import { UsersWishList } from "../../../Schemas/mongoose/Wishlist.schema"
import { CustomRequest, CustomResponse } from "../../../Types/Main"
import { ValidateObject_id } from "../../../Utils/ValidateObject_Id"




export const GetUsersWishList = async (req: CustomRequest, res: CustomResponse) => {
    
    try {
        // get and validate the id in the request params
        ValidateObject_id(req, res)
        const Wishlist = await UsersWishList.find({ UserId: req.params.id }).populate('Wishlist')
        res.status(200).json({Wishlist,length:Wishlist.length})
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message })
        } else {
            res.status(500).json({ error })
        }
    }
}





export const GetUsersCartList = async (req: CustomRequest, res: CustomResponse) => {
    try {
        // Get users cart list
        // get and validate the id in the request params
        ValidateObject_id(req, res)
        const Cart = await UsersCart.find({ UserId: req.params.id }).populate('Cart')
        res.status(200).json({Cart})
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message })
        } else {
            res.status(500).json({ error })
        }
    }
}
