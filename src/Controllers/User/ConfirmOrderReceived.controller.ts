import { EmailSender } from "../../Email/SendMail";
import { User } from "../../Schemas/mongoose/User.schema";
import { UserOrders } from "../../Schemas/mongoose/UserOrder.schema";
import { CustomRequest, CustomResponse } from "../../Types/Main";
import { ValidateObject_id } from "../../Utils/ValidateObject_Id";

export const ConfirmOrderReceived = async(req:CustomRequest,res:CustomResponse) => {
    try {
        // validate request body
        const data = req.body
        
        if (!data.OrderID || !data.Received) {
            res.status(401).json({ error: "both OrderID and Received are required" })
            return
        }
        if (typeof data.Received != "boolean" && typeof data.OrderID != "string") {
            res.status(401).json({error:"Type mismatch",msg:"type of data.Received must be boolean and type of data.OrderID must be string"})
        }
        // validate order ID
        ValidateObject_id(req, res, {
            From: "Custom",
            ID: data.OrderID,
            ErrorMessage:"Order ID is not valid"
        })
        // find and update order in database
        const OrderFromDB = await UserOrders.findById(data.OrderID, { UserId: 1 })
        if (!OrderFromDB) {
            res.status(404).json({ error: "Order Not Found" })
            return
        }
        await UserOrders.findByIdAndUpdate(data.OrderID, { Received: data.Received },{new:true})
        const user = await User.findById(OrderFromDB.UserId, { Email: 1, FullName: 1 })
        if (user) {
            await new EmailSender().CustomEmail({
                Receiver: user.Email,
                UserName: user.FullName,
                Subject:"Order Received",
                Message: "Order Your has been Successfully Received\n Thanks for shopping with us!\n\n\n\n\n\n\n",
            })
        }
        res.status(200).json({success: true,msg:"Order received"});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({error: error.message});
        } else {
            res.status(500).json({ error })
        }
    }
}