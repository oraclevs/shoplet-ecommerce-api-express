import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Product } from '../Schemas/mongoose/Products.schema';


dotenv.config();

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export async function syncProductsToStripe() {
    const products = await Product.find({}); // Fetch all products from your database
    for (const product of products) {
        if (!product.stripePriceId) {
            // Create a Stripe product and price for each product
            const stripeProduct = await stripe.products.create({
                name: product.Name,
                description: product.description,
                // Other product details...
            });

            const price = await stripe.prices.create({
                unit_amount: parseInt(parseFloat(product.price.toString()).toString()) * 100, // Price in cents
                currency: 'usd',
                product: stripeProduct.id,
            });

            // Update your product in the database with the Stripe price ID
            product.stripePriceId = price.id;
            await product.save();
        }
    }
}


