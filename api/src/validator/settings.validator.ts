import Joi from "joi";

export const VAddEsslConfig = Joi.object({
    essl_ip: Joi.string().required(),
    essl_port: Joi.number().required()
})

export const VSaveLateFineConfig = Joi.object({
    amount: Joi.number().min(0).required(),
    applicable_months: Joi.array().items(Joi.string()).required(),
    fine_date: Joi.number().min(1).max(31).required(),
})