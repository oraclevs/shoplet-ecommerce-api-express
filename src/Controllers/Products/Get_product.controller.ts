import { Request, Response } from "express-serve-static-core";
import { Product } from "../../Schemas/mongoose/Products.schema";
import { Types } from "mongoose";



export const GetAllProducts = async (req: Request, res: Response) => {
    try {
        // creating the interface for the query object (the query object from the req.query to use as filter)
        interface queryType {
            brand?: string;
            category?: string;
            price?: object
        }
        const { page, limit, category, min_price, max_price, brand } = req.query;
        const query: queryType = {}
        const pageNumber = parseInt(page as string) || 1;
        const PageLimit = parseInt(limit as string) || 4;
        const PageSkip = (pageNumber - 1) * PageLimit;
        // validating the req.query
        if (category) {
            query.category = category as string
        }
        if (brand) {
            query.brand = brand as string
        }
        if (max_price && min_price) {
            query.price = {
                $gte: min_price, $lte: max_price
            }
        }
        if (max_price) {
            query.price = { $lte: max_price }
        }
        if (min_price) {
            query.price = { $gte: min_price }
        }
        // Search the the product in database
        const productsFromDb = await Product.find(query).skip(PageSkip).limit(PageLimit)
        console.log(productsFromDb)
        // response to the user.
        res.status(200).json({ products: productsFromDb, Length: productsFromDb.length })
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ Error: error.message });
        } else {
            res.status(500).json({ Error: error });
        }
    }
}

export const GetOneProduct = async (req: Request, res: Response) => {
    try {
        const ProductID = req.params.id
        console.log(ProductID)
        // validate product ID from req.params.id 
        const isProductIDvalid = Types.ObjectId.isValid(ProductID)
        if (!isProductIDvalid) { 
            res.status(404).json({ Error: "Product ID is not valid" })
            return
        }
        // search for product in database
        const ProductFromDB = await Product.findById(ProductID)
        // if product product is not found response with error 404
        if (ProductFromDB === null) {
            res.status(404).json({ Error: "Product  Not Found" })
            return
        }
        // return product if found in the database
        res.status(200).json({ product: ProductFromDB})
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ Error: error.message });
        } else {
            res.status(500).json({ Error: error })
        }
    }
}