import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Product,ProductType } from '../Schemas/mongoose/Products.schema';



dotenv.config();


export async function syncProductsToStripe(productId:string|undefined = undefined) {
    const stripe = new Stripe(process.env.STRIPE_API_KEY!);

    const SaveToStripe = async (product: ProductType) => {
        if (!product.stripePriceId) {
            // Create a Stripe product and price for each product
            const stripeProduct = await stripe.products.create({
                name: product.name,
                description: product.description,

            });

            const price = await stripe.prices.create({
                unit_amount: parseInt(parseFloat(product.price.toString()).toString()) * 100, // Price in cents
                currency: 'usd',
                product: stripeProduct.id,
            });

            // Update your product in the database with the Stripe price ID
            product.stripePriceId = price.id;
            product.UpdatedAt = new Date();
            await product.save();
        }
    }
    if (productId === undefined) {
        const products = await Product.find({});
        for (const product of products) {
            SaveToStripe(product)
        }
        return// Fetch all products from the database
    } else {
        const product = await Product.findOne({ _id: productId });
        if (product) {
            SaveToStripe(product)
        }
    }



}


