import { Types } from "mongoose"
import { CustomRequest, CustomResponse } from "../Types/Main"

interface ValidateObject_idType {
    ErrorMessage: string;
    From: "Params" | "Custom";
    ID: string;
}

const Default:ValidateObject_idType = {
    ErrorMessage: "Invalid ID",
    From: "Params",
    ID:"",
}
export const ValidateObject_id = (
    req: CustomRequest,
    res: CustomResponse,
    Options: ValidateObject_idType = Default
) => {
    const ProductID = Options.From === "Params" ? req.params.id : Options.ID
    
    // validate product ID from req.params.id 
    const isProductIDvalid = Types.ObjectId.isValid(ProductID)

    if (!isProductIDvalid) {
        res.status(404).json({ Error:Options.ErrorMessage })
        return
    }
}

