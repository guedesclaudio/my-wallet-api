import joi from "joi"

const schemaEditFlow = joi.object({
    money: joi.number(),
    description: joi.string().max(20)
})