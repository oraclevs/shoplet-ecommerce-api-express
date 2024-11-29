import { Router } from 'express'
import { AdminLogin } from '../../Controllers/Admin/AdminLogin.controller'


const Route = Router()


Route.post('/Login', AdminLogin)

export default Route