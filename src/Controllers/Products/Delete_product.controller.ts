import { Types } from "mongoose";
import { CustomRequest, CustomResponse } from "../../Types/Main";
import { Product } from "../../Schemas/mongoose/Products.schema";


export const DeleteProductFromDb = async (req:CustomRequest,res:CustomResponse) => {
    try {
        // get the id of the product
        const ProductId = req.params.id 
        // validate the product id to make sure it is valid
        const isProductIDvalid = Types.ObjectId.isValid(ProductId)
        if (!isProductIDvalid) {
            res.status(404).json({Success:false, Error: "Product ID is not valid" })
            return
        }
        // find product from database
        
       await Product.deleteOne({ _id: ProductId })
        
        res.status(200).json({success:true, message:"Product deleted successfully"});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({error: error.message});
        } else {
            res.status(500).json({error: error});
        }
    }
}