import joi from "joi"
import dayjs from "dayjs"
import db from "../database/db.js"

const schemaFlow = joi.object({
    money: joi.number().required(),
    description: joi.string().max(20).required()
})

async function registerEntry (req, res) {

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
}

async function registerExit (req, res) {

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
}

async function getCashFlow (req, res) {

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
}

export {
    registerEntry,
    registerExit,
    getCashFlow
}