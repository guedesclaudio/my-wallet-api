import joi from "joi"
import db from "../database/db.js"

const schemaFlow = joi.object({
    money: joi.number().required(),
    description: joi.string().max(20).required()
})

async function userTokenValidation(req, res, next) {

    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")
    
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
        res.locals.user = user

    } catch (error) {
        res.sendStatus(500)
        console.error(error)
        return
    }
    
    console.log("verificou token")
    next()
}

async function moveSchemaValidation(req, res, next) {

    const {error} = schemaFlow.validate(req.body, {abortEarly: false})
    if(error) {
        const errors = error.details.map(value => value.message)
        res.status(422).send(errors)
        return
    }
    console.log("midd 1")
    next()
}

export {userTokenValidation, moveSchemaValidation}