import Stripe from "stripe";
import { UserOrders } from "../../Schemas/mongoose/UserOrder.schema";
import { User } from "../../Schemas/mongoose/User.schema";
import { EmailSender } from "../../Email/SendMail";




export const handleCheckoutSessionCompleted = async(session: Stripe.Checkout.Session) => {
    const Details = {
        CustomerID: session.customer,
        CustomerEmail: session.customer_details?.email,
        CustomerAddress: session.customer_details?.address,
        CustomerPhoneNumber: session.customer_details?.phone,
        ShippingDetails: session.shipping_details,
        Payment: session.payment_status,
        TotalAmount: session.amount_total,
        StripeCheckoutId:session.id
    }
    await UserOrders.findOneAndUpdate({ StripeCheckoutId: Details.StripeCheckoutId },
        {
            PaymentSuccessful: true,
            ShippingDetails: Details.ShippingDetails,
            AmountPaid: Details.TotalAmount,
            UpdatedAt: new Date()
        }, { new: true })
    await User.findOneAndUpdate({
        Email: Details.CustomerEmail
    },
        {
            $addToSet: {
                PhoneNumber: Details.CustomerPhoneNumber,
                Address: Details.CustomerAddress
            }
        }, { new: true })
    await new EmailSender().CustomEmail({
        Subject: "Payment Sucessfully",
        Receiver: Details.CustomerEmail as string,
        UserName: Details.CustomerEmail as string,
        Message:"Your payment has been Received successfully you will receive your order soon",
    })
    
    // You can add your business logic here to process the order
};