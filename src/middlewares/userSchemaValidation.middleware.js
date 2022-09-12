import joi from "joi"

const schemaSignIn = joi.object({
    email: joi.string().email().empty().required(),
    password: joi.string().alphanum().empty().required()
})

const schemaSingUp = joi.object({
    name: joi.string().max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().alphanum().required()
})

async function signinSchemaValidation(req, res, next) {

    res.locals.userSignIn = req.body

    const {error} = schemaSignIn.validate(req.body, {abortEarly: false})

    if(error) {
        const errors = error.details.map(value => value.message)
        res.status(422).send(errors)
        return
    }
    next()
}

async function signupSchemaValidation(req, res, next) {

    delete req.body.confirmPassword
    const {error} = schemaSingUp.validate(req.body, {abortEarly: false})
    
    if(error) {
        const errors = error.details.map(value => value.message)
        res.status(422).send(errors)
        console.log("passou no middleware")
        return
    }
    next()
}

export {signinSchemaValidation, signupSchemaValidation}