import { Router } from 'express'
import { GetAllProducts, GetOneProduct } from '../../../Controllers/Products/Get_product.controller'

const Route = Router()

Route.route('/products').get(GetAllProducts)
Route.route('/product/:id').get(GetOneProduct)
Route.route('/product/reviews/:id').post()


export default Route 