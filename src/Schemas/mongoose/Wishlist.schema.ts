import { model, Schema } from "mongoose";



interface WishlistType {
    UserId: string;
    Wishlist: string[]
}

const UsersWishlistSchema = new Schema<WishlistType>({
    UserId: { type: String, required: true },
    Wishlist: { type: [String], ref: 'Product' }
})

export const UsersWishList = model<WishlistType>('Wishlist', UsersWishlistSchema)