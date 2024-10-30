import {  Request,Response } from "express-serve-static-core";



export const GetAllUsers = async(req: Request, res: Response,) => {
    try {
    res.status(200).json([])
    } catch (error) {
        console.error(error,'error from controller')
   }
}