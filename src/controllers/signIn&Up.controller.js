import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"
import db from "../database/db.js"
import sgMail from '@sendgrid/mail'
import dotenv from "dotenv"
dotenv.config()

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

        await db.collection("users").insertOne({
            name: name.trim(), 
            email: email.trim(), 
            password: encryptedPassword
        })

        if (!sendEmail(email, name)) {
            res.sendStatus(500)
            return
        }

        res.sendStatus(201)

    } catch (error) {
        res.sendStatus(500)
    }
}

export {
    SignIn,
    SignUp
}

async function sendEmail(email, name) {

    sgMail.setApiKey(process.env.API_KEY)

    const message = {
        to: email,
        from: process.env.EMAIL,
        subject: "Boas-vindas MyWallet",
        text: "Hello",
        html: 
        `<h1>Olá, ${name}</h1>
        <br>
        <p>Ficamos muito felizes em ter você conosco! Aproveite o 
        nosso app e mantenha-se informado sobre novas atualizações.</p>
        <br>
        <p>Atenciosamente, equipe MyWallet.</p>`
    }

    try {
        await sgMail.send(message)
        return true
    } catch (error) {
        return false
    }
    
}