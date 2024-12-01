
import { Types } from 'mongoose'
import { UsersCart } from "../../Schemas/mongoose/Cart.schema";
import { CustomRequest, CustomResponse } from "../../Types/Main";



// controller to get the user's cart from the database
export const GetCart = async (req: CustomRequest, res: CustomResponse) => {
    try {
        const UserID = req.UserID;
        const UserCartFromDb = await UsersCart.find({ UserId: UserID }, { Cart: 1, _id: 0 }).populate('Cart')
        const UserCart = UserCartFromDb[0]?.Cart
        
        if (!UserCart) {
            res.status(404).json({ error: "Cart Not Found" })
            return
        }
        res.status(200).json({ Cart: UserCart, length: UserCart.length });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ error: error });
    }
}
// controller to save the user cart to database
export const SaveCart = async (req: CustomRequest, res: CustomResponse) => {
    try {
        // get the userID
        const UserID = req.UserID;
        const Cart: string[] = req.body.Cart; // an array of products IDs
        if (!Cart) {
            res.status(400).json({ Error: "Could not find the Cart Array in the body" })
            return
        }
        // Validate the product ID in the cart array to make sure all of them are valid products IDs and are still in the database
        const InvalidProductID: string[] = []
        const ValidProductID: string[] = []
        for (let i = 0; i < Cart.length; i++) {
            const isProductIDvalid = Types.ObjectId.isValid(Cart[i])
            if (!isProductIDvalid) {
                InvalidProductID.push(Cart[i])
            } else {
                ValidProductID.push(Cart[i])
            }
        }
        if (InvalidProductID.length > 0) {
            res.status(400).json({ error: 'Your Cart array contains invalid product ID' })
            return
        }
        await new UsersCart({
            UserId: UserID,
            Cart: ValidProductID,
        }).save()
        res.status(200).json({ success: true, msg: "Cat has been save successfully " });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ error: error });
    }
}
