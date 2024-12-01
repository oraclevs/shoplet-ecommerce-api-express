
import { EmailSender } from "../../Email/SendMail";
import { Product } from "../../Schemas/mongoose/Products.schema";
import { User } from "../../Schemas/mongoose/User.schema";
import { UserOrders } from "../../Schemas/mongoose/UserOrder.schema";
import { CustomRequest, CustomResponse } from "../../Types/Main"
import { UserAuthInputValidator } from "../../Utils/UserInputValidators";
import { Types } from "mongoose";
import Stripe from 'stripe'


export const UserCheckout = async (req: CustomRequest, res: CustomResponse) => {
    try {

        const { Success, data } = new UserAuthInputValidator().UserCheckoutValidation(req.body.Products)
        if (!Success) {
            throw data
        }
       
        // check if the product ID is valid
        const InvalidProductID: string[] = []
        const ValidProductID: string[] = []
        for (let i = 0; i < data.length; i++) {
            const isProductIDvalid = Types.ObjectId.isValid(data[i].id)
            if (!isProductIDvalid) {
                InvalidProductID.push(data[i].id)
            } else {
                ValidProductID.push(data[i].id)
            }
        }
        if (InvalidProductID.length > 0) {
            res.status(400).json({ error: 'Your Checkout array contains invalid product ID' })
            return
        }
        
        // get the prices of the products
        type LineItemsList = LineItems[]
        interface LineItems {
            price: string;
            quantity: number;
        }
        const NewListItems: LineItemsList = []
        for (let i = 0; i < data.length; i++) {
            const A_Product = await Product.findById(data[i].id, { _id: 0, stripePriceId: 1 })
            
            if (A_Product === null) {
                res.status(404).json({ error: 'Product not found', Product: data[i] })
                return
            }
            const productData: LineItems = {
                quantity: data[i].quantity,
                price: A_Product.stripePriceId,
            }
            NewListItems.push(productData)
        }
        // check if the customer has a verified Email account
        const user = await User.findById(req.UserID, { Email: 1, IsEmailVerified: 1, Address: 1, StripeCustomerID: 1,FullName:1, })
        
        if (!user?.IsEmailVerified) {
            res.status(403).json({ Error: "Email not verified", msg: "Please verify your email to continue checking out" })
            return
        }

        const stripe = new Stripe(process.env.STRIPE_API_KEY as string)
        const PaymentSession = await stripe.checkout.sessions.create({
            
            success_url: "http://localhost:3000/",
            cancel_url: "http://localhost:3000/",
            line_items: NewListItems,
            mode: 'payment',
            customer_email: user.Email,
            shipping_address_collection: {
                allowed_countries: ['US', 'NG',]
            },
            billing_address_collection: "required",
            customer_creation: "if_required",
            phone_number_collection: {
                enabled: true,
            },
        })
        
      
        await new UserOrders({
            UserId: req.UserID,
            orders: data,
            StripeCheckoutId: PaymentSession.id,
            PaymentSuccessful: false,
            CreatedAt: new Date(),
            UpdatedAt: new Date()
        }).save()
        await new EmailSender().CustomEmail({
            Subject: "Order Created ",
            Receiver: user.Email,
            UserName: user.FullName,
            Message:`Your Order has been  Created Successfully. your payment link is ${PaymentSession.url} click to complete the order`
        })
        res.status(200).json({ success: true, PaymentLink:PaymentSession.url});
    } catch (error) {
        if (error instanceof Error) {
            
            res.status(500).json({ error: error.message })
        } else {
            
            res.status(500).json({ error })
        }
    }

}