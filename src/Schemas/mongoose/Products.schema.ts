import { Schema, model,Document } from "mongoose";



[
    {
        "id": "12345",
        "name": "Blue T-Shirt",
        "description": "A comfortable blue t-shirt made from 100% cotton.",
        "brand": "FashionCo",
        "category": "Clothing",
        "subcategory": "T-Shirts",
        "price": 19.99,
        "currency": "USD",
        "stock_quantity": 150,
        "images": [
            "https://example.com/images/product1.jpg",
            "https://example.com/images/product2.jpg"
        ],
        "attributes": {
            "size": ["S", "M", "L", "XL"],
            "color": ["Blue"],
            "material": "Cotton"
        },
        "reviews": [
            {
                "user_id": "user123",
                "rating": 4,
                "comment": "Great fit and comfortable!"
            },
            {
                "user_id": "user456",
                "rating": 5,
                "comment": "Love the color and fabric!"
            }
        ],
        "created_at": "2024-04-01T12:34:56.789Z",
        "updated_at": "2024-04-02T08:23:45.678Z"
    }

]

interface Products {
    stripePriceId:string;
    name: string;
    description: string;
    brand: string;
    category: string
    price: number;
    currency: string;
    stock_quantity: number;
    images: string[];
    attributes: {
        size: string[];
        color: string[];
        material: string[];
    };
    reviews: object[];
    CreatedAt: Date;
    UpdatedAt: Date;

}
export interface ProductType extends  Document,Products{}  

    

const ProductSchema = new Schema<Products>({
    stripePriceId:{type: String},
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    stock_quantity: { type: Number, required: true },
    images: { type: [String], required: true },
    attributes: {
        size: {
            type: [String],
            required: true
        },
        color: {
            type: [String],
            required: true
        },
        material: {
            type: [String],
            required: true
        }
    },
    reviews: { type: [Object] },
    CreatedAt: { type: Date, default: Date.now(), required: true },
    UpdatedAt: { type: Date, default: Date.now(), required: true },
})

export const Product = model<Products>('Product', ProductSchema)
