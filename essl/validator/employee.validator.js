import Joi from "joi";

export const VCreateEmployee = Joi.object({
  device_id: Joi.string().required(),
  user: Joi.object({
    uid: Joi.string().required(),
    userid: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.number().optional(),
    cardno: Joi.number().optional(),
  }).required(),
});

export const VDeleteEmployee = Joi.object({
  device_id: Joi.string().required(),
  uid: Joi.string().required(),
});
