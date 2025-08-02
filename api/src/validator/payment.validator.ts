import Joi from "joi";

export const VCreateOrderValidator = Joi.object({
  form_id: Joi.number().required(),
  fee_head_ids: Joi.array().items(Joi.number()).required(),
});
