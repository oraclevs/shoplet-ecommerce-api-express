import { Request, Response } from "express-serve-static-core"
import { Types } from 'mongoose'
import { UsersWishList } from "../../Schemas/mongoose/Wishlist.schema";

// controller to get the user's cart from the database
export const GetWishlist = async (req: Request, res: Response) => {
    try {
        const UserID = req.body.UserID;
        const UserWishListFromDb = await UsersWishList.find({ UserId: UserID }, { Wishlist: 1, _id: 0 }).populate('Wishlist')
        const UserWishlist = UserWishListFromDb[0]?.Wishlist
        if (!UserWishlist) {
            res.status(404).json({ error: "Wishlist Not Found" })
            return
        }
        res.status(200).json({ Wishlist: UserWishlist, length: UserWishlist.length });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ error: error });
    }
}
// controller to save the user cart to database
export const SaveWishList = async (req: Request, res: Response) => {
    try {
        // get the userID
        const UserID = req.body.UserID;
        const WishList:string[] = req.body.Wishlist; // an array of products IDs
        console.log(UserID)
        console.log("wishList", WishList)
        if (!WishList) {
            res.status(400).json({ Error: "Could not find the Wishlist Array in the body" })
            return
        }
        // Validate the product ID in the WishList array to make sure all of them are valid products IDs and are still in the database
        const InvalidProductID: string[] = []
        const ValidProductID: string[] = []
        for (let i = 0; i < WishList.length; i++) {
            const isProductIDvalid = Types.ObjectId.isValid(WishList[i])
            if (!isProductIDvalid) {
                InvalidProductID.push(WishList[i])
            } else {
                ValidProductID.push(WishList[i])
            }
        }
        if (InvalidProductID.length > 0) {
            res.status(400).json({ error: 'Your Cart array contains invalid product ID' })
            return
        }
        console.log("ValidProductID:", ValidProductID, "InvalidProductID:", InvalidProductID)
        await new UsersWishList({
            UserId: UserID,
            Wishlist: ValidProductID,
        }).save()
        res.status(200).json({ success: true, msg: "WishList has been save successfully " });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ error: error });
    }
}
