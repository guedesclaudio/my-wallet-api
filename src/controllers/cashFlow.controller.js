import dayjs from "dayjs"
import db from "../database/db.js"


async function registerEntry (req, res) {

    const {money, description} = req.body
    const user = res.locals.user
    
    try {
        await db.collection("cashflow").insertOne({
            userId: user.userId, 
            type: "entry", 
            money: Number(money).toFixed(2), 
            description: description[0].toUpperCase() + description.substring(1), 
            date: dayjs().format("DD/MM")
        })
        res.sendStatus(201)

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

async function registerExit (req, res) {

    const {money, description} = req.body
    const user = res.locals.user

    try {
        await db.collection("cashflow").insertOne({
            userId: user.userId, 
            type: "exit", 
            money: Number(money).toFixed(2), 
            description: description[0].toUpperCase() + description.substring(1), 
            date: dayjs().format("DD/MM")
        })
        res.sendStatus(201)

    } catch (error) {
        res.sendStatus(500)
    }
}

async function getCashFlow (req, res) {

    const user = res.locals.user
    let total = 0

    try {

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