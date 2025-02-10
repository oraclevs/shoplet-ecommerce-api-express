import { model, Schema } from "mongoose";



interface CartType {
    UserId: string;
    Cart:string[]
}

const UsersCartSchema = new Schema<CartType>({
    UserId: { type: String, required: true },
    Cart: { type: [String], ref:'Product' }
})

export const UsersCart = model<CartType>('Cart',UsersCartSchema )