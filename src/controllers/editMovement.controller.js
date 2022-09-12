import {ObjectId} from "mongodb"
import dayjs from "dayjs"
import db from "../database/db.js"

async function deleteMove (req, res) {

    const {id} = req.params

    try {
        const move = await db.collection("cashflow").findOne({_id: new ObjectId(id)})
        
        if(!move) {
            res.sendStatus(404)
            return
        }

        await db.collection("cashflow").deleteOne({_id: new ObjectId(id)})

    } catch (error) {
        res.sendStatus(500)
    }
}

async function updateMove (req, res) {

    let {money} = req.body
    let data = req.body
    const id = res.locals.id

    if(money) {
        data = {...data, money: Number(money).toFixed(2)}
    }

    try {
        const move = await db.collection("cashflow").findOne({_id: new ObjectId(id)})
        
        if(!move) {
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
}

export {
    deleteMove,
    updateMove
}