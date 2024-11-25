import Express,{ Router } from "express";
import { StripeUserPaymentVerification } from "../../Controllers/User/StripePayment.contollers";
// import bodyParser from "body-parser";


const Route = Router()

Route.post('/', Express.raw({ type: 'application/json' }),  StripeUserPaymentVerification)

export default Route
