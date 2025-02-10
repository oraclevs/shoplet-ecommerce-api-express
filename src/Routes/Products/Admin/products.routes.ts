import { Router } from "express";
import { GetAllProducts, GetOneProduct } from "../../../Controllers/Products/Get_product.controller";
import { AddProductToDb } from "../../../Controllers/Products/Add_Product.controllers";
import { DeleteProductFromDb } from "../../../Controllers/Products/Delete_product.controller";
import { UpdateProduct } from "../../../Controllers/Products/Update_product.controller";

const Route = Router()

// get/update/delete products
Route.route('/products').get(GetAllProducts).post(AddProductToDb)
Route.route('/product/:id').get(GetOneProduct).patch(UpdateProduct).delete(DeleteProductFromDb)



export default Route
