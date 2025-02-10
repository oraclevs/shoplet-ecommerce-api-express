
import { CustomRequest, CustomResponse } from "../../Types/Main";
import Stripe from 'stripe';
import { handleCheckoutSessionCompleted } from "./UserCheckoutComplete.controller";






export const StripeUserPaymentVerification = async (req: CustomRequest, res: CustomResponse) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    const stripe = new Stripe(process.env.STRIPE_API_KEY as string)
    let event: Stripe.Event;
    try {
        if (!req.rawBody) { throw new Error('Raw body not available'); }
        
        // Use the raw body directly for signature verification
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook error: ${err}`);
        res.status(400).send(`Webhook error: ${err}`);
        return;
    }
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            handleCheckoutSessionCompleted(session);
            break;
        // ... handle other event types
        default:
            // console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
};




