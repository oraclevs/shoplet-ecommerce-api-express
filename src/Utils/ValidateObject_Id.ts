import { Types } from "mongoose"
import { CustomRequest, CustomResponse } from "../Types/Main"

export const ValidateObject_id = (req: CustomRequest, res: CustomResponse, ErrorMessage = "ID is not valid") => {
    const ProductID = req.params.id
    console.log(ProductID)
    // validate product ID from req.params.id 
    const isProductIDvalid = Types.ObjectId.isValid(ProductID)
    if (!isProductIDvalid) {
        res.status(404).json({ Error: ErrorMessage })
        return
    }
}