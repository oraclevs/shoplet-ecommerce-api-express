import { Router } from "express";
import { GetNewVerificationCode, VerifyEmail } from "../../Controllers/User/EmailVerification.controllers";
import { GetCart, SaveCart } from "../../Controllers/User/Cart.contollers";
import { GetWishlist, SaveWishList } from "../../Controllers/User/Wishlist.contollers";
import { updateProfilePicture } from "../../Controllers/User/UpdateUserprofile.controller";
import { UpdateUserProfileDetails } from "../../Controllers/User/UpdateUserProfileDetails.controllers";
import { UserCheckout } from "../../Controllers/User/UserCheckout.controllers";


const Route = Router();

// Email verification
//  get route is to the a new email verification code to  the user email address
// and the post route is to send  the code for the email verification and verify the user email
Route.route('/emailverification').get(GetNewVerificationCode).post(VerifyEmail)
// Cart Route
Route.route('/cart').get(GetCart).post(SaveCart)
// WishList Route
Route.route('/wishlist').get(GetWishlist).post(SaveWishList)
// Update user profilePicture route
Route.patch('/updateuserprofilepicture', updateProfilePicture)
Route.patch('/updateuserprofiledetails', UpdateUserProfileDetails)

// User checkOut routes
Route.post('/checkout',UserCheckout)

export default Route