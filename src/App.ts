import dotenv from 'dotenv'
import Express from "express";
import ConnectDB from "./Db/ConnectToDB";
import UserRoutes from "./Routes/Users/User.Routes"
import UserAuthRoutes from './Routes/Users/UserAuth.Routes'
import UserProductRoutes from './Routes/Products/User/Products.Routes'
import AdminProductRoutes from './Routes/Products/Admin/products.routes'
import AdminRefreshTokenRoute from './Routes/Admin/Admin_refreshtoken.routes'
import AdminManageUsersRoute from './Routes/Admin/Users/Admin_users.routes'
// import { rateLimit } from 'express-rate-limit'
// import cors from 'cors'
import cookieParser from 'cookie-parser';
import { ProtectUserRoutes } from './Middlewares/Protect.User.route';
// import { syncProductsToStripe } from './Utils/Stripe_price_setup';
import StripeUserPaymentVerifications from './Routes/Users/stripe.Routes'
import { CustomRequest } from './Types/Main';
import AdminAuthRoute from './Routes/Admin/AdminAuth.routes'
import { ProtectAdminRoutes } from './Middlewares/Protect.Admin.route';



dotenv.config({ path: 'src/.env' })

const PORT: number = parseInt(process.env.PORT as string) || 5000

const app = Express();

// 
// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 150, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// 	standardHeaders: 'draft-7', 
// 	legacyHeaders: false, 

// })


// Middlewares
app.use(Express.urlencoded({ extended: true }))
app.use(Express.json(
    {
        verify: (req: CustomRequest, res, buf) => {
            req.rawBody = buf
        }
    }
))
// app.use(limiter)
// app.use(cors({origin:"",credentials:true}))
app.use(cookieParser())



// USER ROUTES
//  Authentication Routes for Users
app.use('/api/v1/users/auth/', UserAuthRoutes)
// Routes for Users
app.use('/api/v1/user', ProtectUserRoutes, UserRoutes)
// Routes for Products
app.use('/api/v1/products/user', ProtectUserRoutes, UserProductRoutes)
// Route for Stripe Webhooks(User)
app.use('/api/v1/StripeUserPaymentVerification', StripeUserPaymentVerifications)

// ADMIN ROUTES
app.use('/api/v1/admin/auth', AdminAuthRoute)
// admin product routes
app.use('/api/v1/products/admin', ProtectAdminRoutes, AdminProductRoutes)
// admin get refreshed token for admin
app.use('/api/v1/admin/auth/refreshToken', AdminProductRoutes, AdminRefreshTokenRoute)
// admin route to manage users
app.use('/api/v1/admin/users', ProtectAdminRoutes, AdminManageUsersRoute)






// Server Start up 
app.listen(PORT, async () => {
    await ConnectDB()
    console.log(`running on port ${PORT}`)
}).on('error', (error) => console.log(error.message))


