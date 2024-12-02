import { Router } from "express";
import { GetNewVerificationCode, VerifyEmail } from "../../Controllers/User/EmailVerification.controllers";
import { DeleteCart, GetCart, SaveCart } from "../../Controllers/User/Cart.contollers";
import { DeleteWishList, GetWishlist, SaveWishList } from "../../Controllers/User/Wishlist.contollers";
import { updateProfilePicture } from "../../Controllers/User/UpdateUserprofile.controller";
import { UpdateUserProfileDetails } from "../../Controllers/User/UpdateUserProfileDetails.controllers";
import { UserCheckout } from "../../Controllers/User/UserCheckout.controllers";
import { ConfirmOrderReceived } from "../../Controllers/User/ConfirmOrderReceived.controller";


const Route = Router();

// Email verification
//  get route is to the a new email verification code to  the user email address
// and the post route is to send  the code for the email verification and verify the user email
Route.route('/email-verification').get(GetNewVerificationCode).post(VerifyEmail)
// Cart Route
Route.route('/cart').get(GetCart).post(SaveCart)
Route.route('/cart/:id').delete(DeleteCart)
// WishList Route
Route.route('/wishlist').get(GetWishlist).post(SaveWishList).delete(DeleteWishList)
Route.route('/wishlist/:id').delete(DeleteWishList)
// Update user profilePicture and UpdateUserProfileDetails route
Route.patch('/update-user-profile-picture', updateProfilePicture)
Route.patch('/update-user-profile-details', UpdateUserProfileDetails)
// User checkOut routes
Route.post('/checkout', UserCheckout)
// Confirm Order Received route
Route.post('/confirm-order-received', ConfirmOrderReceived)
export default Route