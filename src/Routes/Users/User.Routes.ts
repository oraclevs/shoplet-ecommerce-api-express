import  { Router } from "express";
import { GetAllUsers } from "../../Controllers/User/User.Controller";


const Route = Router();





// user get routes to all users from db
Route.get('/allusers', GetAllUsers)


// user get routes to a single users from db
Route.get('/user/:id', GetAllUsers)





export default Route