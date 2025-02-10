import { EmailSender } from "../../../Email/SendMail";
import { UserOrders } from "../../../Schemas/mongoose/UserOrder.schema";
import { CustomRequest, CustomResponse } from "../../../Types/Main"
import { AdminInputValidator } from "../../../Utils/AdminInputValidators";
import { ValidateObject_id } from "../../../Utils/ValidateObject_Id";
import { User } from './../../../Schemas/mongoose/User.schema';


export const GetUsersOrders = async(req:CustomRequest,res:CustomResponse) => {
    try {
        // validate the Userid from req prams
        ValidateObject_id(req, res)
        // get the user orders
        interface queryType {
            UserId: string;
            PaymentSuccessful?: boolean
        }
        const { page, limit, PaymentSuccessful } = req.query;
        const query: queryType ={UserId:req.params.id}
        if (PaymentSuccessful) {
            if (PaymentSuccessful.toString().toLowerCase() === "true") { 
                query.PaymentSuccessful = true;
            } else if (PaymentSuccessful.toString().toLowerCase() === "false") {
                query.PaymentSuccessful = false;
            }
        }
        const pageNumber = parseInt(page as string) || 1;
        const PageLimit = parseInt(limit as string) || 10;
        const PageSkip = (pageNumber - 1) * PageLimit;
        const Orders = await UserOrders.find(query).skip(PageSkip).limit(PageLimit)
        res.status(200).json({Orders})
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({error: error.message});
        } else {
            res.status(500).json({ error })
        }
    }
}

export const UpdateUserOrder = async(req:CustomRequest,res:CustomResponse) => {
    try {
        // validate userid from the params 
        ValidateObject_id(req, res);
        // validate orderId from req.body
        const OrderID = req.body.OrderId
        if (!OrderID) {
            res.status(403).json({ Error: "OrderId not found in the request body" })
            return;
        }
        ValidateObject_id(req, res,
            { ID: OrderID, From: "Custom", ErrorMessage: "Invalid Order ID" }
        );
        // check if order exists in the database
        const FindOrderInDB = await UserOrders.findOne({ _id: OrderID })
        if (!FindOrderInDB) {
            res.status(404).json({ Error: "Order not found" })
            return
        }
        // validate request body
        const { success, data } = new AdminInputValidator().validateAdminUpdateUserOrderDataInput(req.body)
        if (!success) {
            throw data
        }
        await UserOrders.findByIdAndUpdate(OrderID, data, { new: true })
        const user =  await User.findById(FindOrderInDB.UserId,{Email:1,FullName:1})
        if (data.Shipped != undefined && data.Shipped == true && user) {
            new EmailSender().CustomEmail({
                Receiver: user.Email,
                UserName: user.FullName,
                Subject: "Order Shipped 🚢",
                Message: "Your order has been shipped successfully ",
            })
        }
        if (data.Delivered != undefined && data.Delivered == true && user) {
            new EmailSender().CustomEmail({
                Receiver: user.Email,
                UserName: user.FullName,
                Subject: "Order Delivered 🚢",
                Message: "Your order has been delivered successfully ",
            })
        }
        res.status(200).json({success:true, msg:"Order updated successfully"})
    } catch (error) {
        if (error instanceof Error) { 
            res.status(500).json({error: error.message});
        } else {
            res.status(500).json({error});
        }
    }
}