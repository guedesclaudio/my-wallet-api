import joi from "joi"
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"
import db from "../database/db.js"


async function SignIn (req, res) {

    const {email, password} = res.locals.userSignIn
    
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
}

async function SignUp (req, res) {

    const {name, email, password} = req.body
    delete req.body.confirmPassword
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
}

export {
    SignIn,
    SignUp
}