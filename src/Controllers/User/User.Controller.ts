import { Request,Response } from "express-serve-static-core";
import { User } from "../../Schemas/mongoose/User.schema";


export const GetAllUsers = async(req: Request, res: Response) => {
    try {
        const user = new User({
        FullName: "iiiiiiii",
        UserName: "hhhhhhhhhhhhhh",
        Email: "king@gmail.com",
        Password: "88777777777",
        Gender: 'Male',
        Address: ["ki"],
        Avatar: "6666666666",
        AuthToken: "uuuuuuuuuu",
        CreatedAt: Date.now(),
        UpdatedAt: Date.now()
            
    })
    await user.save()
    res.status(200).json([])
    } catch (error) {
        console.error(error,'error from controller')
   }
}