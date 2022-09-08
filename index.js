import express from "express"
import cors from "cors"
import joi from "joi"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import {MongoClient, ObjectId} from "mongodb"
import {v4 as uuid} from "uuid"
import dayjs from "dayjs"
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

const schemaSignIn = joi.object({
    email: joi.string().email().required(),
    password: joi.string().alphanum().required()
})

const schemaSingUp = joi.object({
    name: joi.string().max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().alphanum().required()
})

const schemaFlow = joi.object({
    money: joi.number().required(),
    description: joi.string().max(20).required()
})

const schemaEditFlow = joi.object({
    money: joi.number(),
    description: joi.string().max(20)
})


app.post("/signin", async (req, res) => {

    const {email, password} = req.body

    const {error} = schemaSignIn.validate(req.body, {abortEarly: false})

    if(error) {
        const errors = error.details.map(value => value.message)
        res.status(422).send(errors)
        return
    }

    try {
        const user = await db.collection("users").findOne({email})

        if(!user) {
            res.status(404).send({message: "user not found"})
            return
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)

        if (!passwordIsValid) {
            res.sendStatus(401)
            return
        }

        delete user.password

        const checkSession = await db.collection("sessions").findOne({userId: user._id})

        if (checkSession) {
            res.status(200).send({...user, token: checkSession.token})
            return
        }

        const token = uuid()
        await db.collection("sessions").insertOne({userId: user._id, token})
        res.status(200).send({...user, token})
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
    const {error} = schemaSingUp.validate(req.body, {abortEarly: false})

    if(error) {
        const errors = error.details.map(value => value.message)
        res.status(422).send(errors)
        return
    }

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

app.post("/entries", async (req, res) => {

    const {money, description} = req.body
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")
    const {error} = schemaFlow.validate(req.body, {abortEarly: false})

    if(error) {
        const errors = error.details.map(value => value.message)
        res.status(422).send(errors)
        return
    }

    if (!token) {
        res.sendStatus(401)
        return
    }

    try {
        const user = await db.collection("sessions").findOne({token})
        
        if (!user) {
            res.sendStatus(401)
            return
        }

        await db.collection("cashflow").insertOne({
            userId: user.userId, 
            type: "entry", 
            money: Number(money).toFixed(2), 
            description, 
            date: dayjs().format("DD/MM")
        })
        res.sendStatus(201)

    } catch (error) {
        res.sendStatus(500)
    }
})

app.post("/exits", async (req, res) => {

    const {money, description} = req.body
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")
    const {error} = schemaFlow.validate(req.body, {abortEarly: false})

    if(error) {
        const errors = error.details.map(value => value.message)
        res.status(422).send(errors)
        return
    }

    if (!token) {
        res.sendStatus(401)
        return
    }

    try {
        const user = await db.collection("sessions").findOne({token})
        
        if (!user) {
            res.sendStatus(401)
            return
        }

        await db.collection("cashflow").insertOne({
            userId: user.userId, 
            type: "exit", 
            money: Number(money).toFixed(2), 
            description, 
            date: dayjs().format("DD/MM")
        })
        res.sendStatus(201)

    } catch (error) {
        res.sendStatus(500)
    }
})

app.get("/cashflow", async (req, res) => {

    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")
    let total = 0

    if (!token) {
        res.sendStatus(401)
        return
    }

    try {
        const user = await db.collection("sessions").findOne({token})

        if (!user) {
            res.sendStatus(401)
            return
        }

        const cashflow = await db.collection("cashflow").find({userId: user.userId}).toArray()
        
        cashflow.map(value => {
            if (value.type === "entry") {
                total += Number(value.money)
            }
            else {
                total -= Number(value.money)
            }
        })
        res.status(200).send([{cashflow}, {total: total.toFixed(2)}])

    } catch (error) {
        res.sendStatus(500)
    }
})

app.delete("/deletemove/:id", async (req, res) => {

    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")
    const {id} = req.params

    if (!token) {
        res.sendStatus(401)
        return
    }

    try {
        const user = await db.collection("sessions").findOne({token})
        const move = await db.collection("cashflow").findOne({_id: new ObjectId(id)})

        if (!user) {
            res.sendStatus(401)
            return
        }
        if(!move) {
            res.sendStatus(404)
        }

        await db.collection("cashflow").deleteOne({_id: new ObjectId(id)})

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }

})

app.put("/putmove/:id", async (req, res) => {

    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")
    const {id} = req.params
    let {money} = req.body
    const {error} = schemaEditFlow.validate(req.body)
    let data = req.body

    if(error) {
        const errors = error.details.map(value => value.message)
        res.status(422).send(errors)
        return
    }
    if (!token || !id) {
        res.sendStatus(401)
        return
    }
    if(money) {
        data = {...data, money: Number(money).toFixed(2)}
    }

    try {
        const user = await db.collection("sessions").findOne({token})
        const move = await db.collection("cashflow").findOne({_id: new ObjectId(id)})
        

        if(!user || !move) {
            res.sendStatus(401)
            return 
        }

        await db.collection("cashflow").updateOne({_id: new ObjectId(id)}, {$set: 
            {...data, date: dayjs().format("DD/MM")}
        })
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
})

app.listen(5000, () => console.log("Server listening on port 5000"))