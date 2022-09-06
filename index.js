import express from "express"
import {MongoClient, ObjectId} from "mongodb"
import cors from "cors"
import joi from "joi"
import dotenv from "dotenv"
dotenv.config()

const mongoClient = new MongoClient("")
let db

mongoClient
    .connect()
    .then(() => {
        db = mongoClient.db("")
    })

const app = express()
app
    .use(cors())
    .use(express.json())

app.post("/signin", (req, res) => {

})

app.post("/signup", (req, res) => {

})