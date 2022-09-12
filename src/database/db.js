import {MongoClient, ObjectId} from "mongodb"
import dotenv from "dotenv"
dotenv.config()

const mongoClient = new MongoClient(process.env.MONGO_URI)

try {
    await mongoClient.connect()
} catch (error) {
    console.error(`MONGO ERROR ${error}`)
}

const db = mongoClient.db("mywallet")

export default db