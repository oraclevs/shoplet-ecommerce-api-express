import { Schema,model } from "mongoose";



interface OrderType {
    orders: [];
    UserId: string;
    StripeCheckoutId: string;
    PaymentSuccessful: boolean;
    ShippingDetails: object;
    AmountPaid: number;
    Shipped: boolean;
    Received: boolean;
    Delivered: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}

const OrderSchema = new Schema<OrderType>({
    orders: { type: [Object], required: true },
    UserId: { type: String, required: true },
    StripeCheckoutId: { type: String },
    PaymentSuccessful: { type: Boolean, required: true },
    ShippingDetails: { type: Object },
    AmountPaid: { type: Number },
    Shipped: { type: Boolean, default: false },
    Received:{ type: Boolean, default: false },
    Delivered:{ type: Boolean, default: false },
    CreatedAt: { type: Date, required: true },
    UpdatedAt: { type: Date, required: true },
})

export const UserOrders = model<OrderType>('UserOrder',OrderSchema) 