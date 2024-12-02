
import { Router } from "express";
import { RegisterUser } from "../../Controllers/User/UserRegister.controller";
import { GenerateRefreshToken, LogoutUser } from '../../Middlewares/Protect.User.route'
import { LoginUser } from "../../Controllers/User/UserLogin.controller";


const Route = Router()

Route.post('/register',RegisterUser)
Route.post('/login', LoginUser)
Route.post('/logout',LogoutUser)
Route.get('/refresh-token', GenerateRefreshToken)
export default Route
