import Joi from "joi";

export const VSendNotice = Joi.object({
  type: Joi.string().valid("Stuff", "Student").required(),
  title: Joi.string().required(),
  send_to: Joi.array().items(Joi.number().required()).required(),
  description: Joi.string().required(),
});

export const VSingleNotice = Joi.object({
  id: Joi.number().required(),
});
