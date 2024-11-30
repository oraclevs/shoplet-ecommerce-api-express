import { Router } from "express";
import { GetOneUser, GetUsers, UpdateUser } from "../../../Controllers/Admin/Users/Manage_users.controllers";
import { GetUsersCartList, GetUsersWishList } from "../../../Controllers/Admin/Users/Manage_users_cart_and_wishlist.controllors";


const Route = Router()


Route.route('/').get(GetUsers)
Route.route('/:id').get(GetOneUser).patch(UpdateUser)
Route.route('/getuserwishlist/:id').get(GetUsersWishList)
Route.route('/getusercart/:id').get(GetUsersCartList)



export default Route