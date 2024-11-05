import { Router } from "express";

import { GetNewVerificationCode, VerifyEmail } from "../../Controllers/User/EmailVerification.controllers";
import { GetCart, SaveCart } from "../../Controllers/User/Cart.contollers";


const Route = Router();


// Email verification
//  get route is to the a new email verification code to  the user email address
// and the post route is to send  the code for the email verification and verify the user email
Route.route('/emailverification').get(GetNewVerificationCode).post(VerifyEmail)

Route.route('/cart').get(GetCart).post(SaveCart)

export default Route