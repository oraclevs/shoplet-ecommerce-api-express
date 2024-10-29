
import { Router } from "express";
import { RegisterUser } from "../../Controllers/User/UserRegister.controller";


const Route = Router()

Route.post('/register',RegisterUser)
Route.post('/login')

export default Route
