import express from "express"
import cors from "cors"
import joi from "joi"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import {MongoClient, ObjectId} from "mongodb"
import {v4 as uuid} from "uuid"
dotenv.config()

const mongoClient = new MongoClient(process.env.MONGO_URI)
let db

mongoClient
    .connect()
    .then(() => {
        db = mongoClient.db("mywallet")
    })

const app = express()
app
    .use(cors())
    .use(express.json())

app.post("/signin", async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await db.collection("users").findOne({email})
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        const checkSession = await db.collection("sessions").findOne({userId: user._id})

        if(!user) {
            res.sendStatus(404)
            return
        }
        if (!passwordIsValid) {
            res.sendStatus(401)
            return
        }
        if (checkSession) {
            res.status(200).send(checkSession.token)
            return
        }

        const token = uuid()
        await db.collection("sessions").insertOne({userId: user._id, token})
        res.status(200).send(token)
        return

    } catch (error) {

        res.sendStatus(500)
        console.error(error)
        return
    }
})

app.post("/signup", async (req, res) => {
    const {name, email, password} = req.body

    const encryptedPassword = bcrypt.hashSync(password, 10)

    try {
        const checkUser = await db.collection("users").findOne({email})
        
        if (checkUser) {
            res.sendStatus(409)
            return
        }

        await db.collection("users").insertOne({name, email, password: encryptedPassword})
        res.sendStatus(201)
        return 

    } catch (error) {
        res.sendStatus(500)
        return
    }
})

app.listen(5000, () => console.log("Server listening on port 5000"))