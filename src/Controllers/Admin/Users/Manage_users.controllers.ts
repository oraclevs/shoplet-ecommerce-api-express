import { Types } from "mongoose";
import { User } from "../../../Schemas/mongoose/User.schema";
import { CustomRequest, CustomResponse } from "../../../Types/Main"
import { AdminInputValidator } from "../../../Utils/AdminInputValidators";


export const GetUsers = async (req: CustomRequest, res: CustomResponse) => {
    try {

        // creating the interface for the query object (the query object from the req.query to use as filter)
        interface queryType {
            IsEmailVerified?: boolean;
            Blocked?: {
                IsBlocked: boolean;
            };
        }
        const { page, limit, IsEmailVerified, IsBlocked } = req.query;
        const query: queryType = {}
        const pageNumber = parseInt(page as string) || 1;
        const PageLimit = parseInt(limit as string) || 10;
        const PageSkip = (pageNumber - 1) * PageLimit;
        console.log(PageSkip)
        // validating the req.query
        if (IsEmailVerified) {
            if (IsEmailVerified.toString().toLowerCase() === "true") {
                query.IsEmailVerified = true;
            } else if (IsEmailVerified.toString().toLowerCase() === "false") {
                query.IsEmailVerified = false;
            }

        }
        if (IsBlocked) {
            if (IsBlocked.toString().toLowerCase() === "true") {
                query.Blocked = { IsBlocked: true };
            } else if (IsBlocked.toString().toLowerCase() === "false") {
                query.Blocked = { IsBlocked: false };
            }
        }
        console.log(query)

        // Search the the product in database
        const UserFromDb = await User.find(
            query, {
            AuthToken: 0,
            CreatedAt: 0,
            UpdatedAt: 0,
            Role: 0,
            Password: 0,
        }
        ).skip(PageSkip).limit(PageLimit)
        console.log(UserFromDb)
        res.status(200).json({ Users: UserFromDb, length: UserFromDb.length })
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error });
        }
    }
}
export const GetOneUser = async (req: CustomRequest, res: CustomResponse) => {
    try {
        const UserID = req.params.id
        console.log(UserID)
        // validate product ID from req.params.id 
        const isUserIDvalid = Types.ObjectId.isValid(UserID)
        if (!isUserIDvalid) {
            res.status(404).json({ Error: "Product ID is not valid" })
            return
        }
        // search for product in database
        const UserFromDB = await User.findById(UserID,
            {
                AuthToken: 0,
                CreatedAt: 0,
                UpdatedAt: 0,
                Role: 0,
                Password: 0,
            }
        )
        // if product product is not found response with error 404
        if (UserFromDB === null) {
            res.status(404).json({ Error: "Product  Not Found" })
            return
        }
        // return product if found in the database
        res.status(200).json({ product: UserFromDB })
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error });
        }
    }
}
export const UpdateUser = async (req: CustomRequest, res: CustomResponse) => {
    try {

        // get the id of the product
        const userID = req.params.id
        // validate the product id to make sure it is valid
        const isUserValid = Types.ObjectId.isValid(userID)
        if (!isUserValid) {
            res.status(404).json({ Success: false, Error: "Product ID is not valid" })
            return
        }
        // feature to block user
        if (req.body.Blocked.Duration) {
            req.body.Blocked.Duration.to = new Date(req.body.Blocked.Duration.to)
            req.body.Blocked.Duration.from = new Date(req.body.Blocked.Duration.from)
        }
        console.log(req.body)
        // validate user input
        const { success, data } = new AdminInputValidator().validateAdminUpdateUserDataInput(req.body)

        console.log(success, data)
        if (!success) {
            throw data
        }
        await User.updateOne({ _id: userID }, data, { new: true })
        res.status(200).json({ data })
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error });
        }
    }
}
