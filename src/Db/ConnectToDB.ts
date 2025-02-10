import { connect } from "mongoose"


 const ConnectDB = async() => {
    try {
        await connect(process.env.MONGO_DB_CONNECTION_URI as string)
        console.log('Database connection established')
    } catch (error) {
        console.error(error)
    }
}

export default ConnectDB