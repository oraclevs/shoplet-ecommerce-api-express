import { Router } from "express";
import { GetOneUser, GetUsers, UpdateUser } from "../../../Controllers/Admin/Users/Manage_users.controllers";
import { GetUsersCartList, GetUsersWishList } from "../../../Controllers/Admin/Users/Manage_users_cart_and_wishlist.controllors";
import { GetUsersOrders, UpdateUserOrder } from "../../../Controllers/Admin/Users/Manage_users_orders.controllers";
import { MailUser } from "../../../Controllers/Admin/Users/Mail_users.contollers";


const Route = Router()


Route.route('/').get(GetUsers)
Route.route('/:id').get(GetOneUser).patch(UpdateUser)
Route.route('/getuserwishlist/:id').get(GetUsersWishList)
Route.route('/getusercart/:id').get(GetUsersCartList)
Route.route('/userorder/:id').get(GetUsersOrders).patch(UpdateUserOrder)
Route.route('/mailusers').post(MailUser)



export default Route