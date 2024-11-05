import { Request, Response } from "express-serve-static-core"
import { Types } from 'mongoose'
import { UsersCart } from "../../Schemas/mongoose/Cart.schema";

// controller to get the user's cart from the database
export const GetCart = async (req: Request, res: Response) => {
    try {
        const UserID = req.body.UserID;
        const UserCartFromDb = await UsersCart.find({ UserId: UserID }, { Cart: 1, _id: 0 }).populate('Cart')
        const UserCart = UserCartFromDb[0]?.Cart
        res.status(200).json({ Cart: UserCart, length:UserCart.length});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ error: error });
    }
}
// controller to save the user cart to database
export const SaveCart = async (req: Request, res: Response) => {
    try {
        // get the userID
        const UserID = req.body.UserID;
        const Cart = req.body.Cart; // an array of products IDs
        console.log(UserID)
        console.log("Cart", Cart)
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
        console.log("ValidProductID:", ValidProductID, "InvalidProductID:", InvalidProductID)
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
