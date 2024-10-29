import dotenv from 'dotenv'
import Express from "express";
import ConnectDB from "./Db/ConnectToDB";
import UserRoutes from "./Routes/Users/User.Routes"
import UserAuthRoutes from './Routes/Users/UserAuth.Routes'
// import { rateLimit } from 'express-rate-limit'
// import cors from 'cors'
import cookieParser from 'cookie-parser';




dotenv.config({path:'src/.env'})

const PORT: number  = parseInt(process.env.PORT as string) || 5000  

const app = Express();

// 
// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 150, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// 	standardHeaders: 'draft-7', 
// 	legacyHeaders: false, 
	
// })



// Middlewares
app.use(Express.json())
// app.use(limiter)
// app.use(cors({origin:"",credentials:true}))
app.use(Express.urlencoded({ extended: false }))
app.use(cookieParser())



//  Authentication Routes for Users
app.use('/api/vi/users/auth/',UserAuthRoutes)
// Routes for Users
app.use('/api/v1/users',UserRoutes)





// Server Start up 
app.listen(PORT, async () => {
    await ConnectDB()
    console.log(`running on port ${PORT}`)
}).on('error', (error) => console.log(error.message))


