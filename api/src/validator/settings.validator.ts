import Joi from "joi";

export const VAddEsslConfig = Joi.object({
    essl_ip: Joi.string().required(),
    essl_port: Joi.number().required()
})