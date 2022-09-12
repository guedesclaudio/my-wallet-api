import joi from "joi"

const schemaEditFlow = joi.object({
    money: joi.number(),
    description: joi.string().max(20)
})

async function editSchemaValidation(req, res, next) {

    const {error} = schemaEditFlow.validate(req.body)
    const {id} = req.params
    res.locals.id = id

    if(error) {
        const errors = error.details.map(value => value.message)
        res.status(422).send(errors)
        return
    }
    if (!id) {
        res.sendStatus(401)
        return
    }

    next()
}

export default editSchemaValidation