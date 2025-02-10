import { Router } from "express";
import { GenerateRefreshTokenForAdmin } from "../../Middlewares/Protect.Admin.route";


const Route = Router();

Route.route('/').get(GenerateRefreshTokenForAdmin)


export default Route