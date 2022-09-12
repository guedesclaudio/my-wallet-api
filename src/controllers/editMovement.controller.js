import joi from "joi"
import {ObjectId} from "mongodb"
import dayjs from "dayjs"
import db from "../database/db.js"

const schemaEditFlow = joi.object({
    money: joi.number(),
    description: joi.string().max(20)
})

async function deleteMove (req, res) {

    const {id} = req.params
    console.log('deletou')

    try {
        const move = await db.collection("cashflow").findOne({_id: new ObjectId(id)})

        if(!move) {
            res.sendStatus(404)
        }

        await db.collection("cashflow").deleteOne({_id: new ObjectId(id)})

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

async function updateMove (req, res) {

    const {id} = req.params
    let {money} = req.body
    const {error} = schemaEditFlow.validate(req.body)
    let data = req.body

    if(error) {
        const errors = error.details.map(value => value.message)
        res.status(422).send(errors)
        return
    }
    if (!id) {
        res.sendStatus(401)
        return
    }
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