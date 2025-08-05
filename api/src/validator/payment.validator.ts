import Joi from "joi";

export const VCreateOrderValidator = Joi.object({
  form_id: Joi.number().required(),
  // fee_head_ids: Joi.array().items(Joi.number()).required(),
  fee_structure_info: Joi.array()
    .items(
      Joi.object({
        fee_head_id: Joi.number().required(),
        custom_min_amount: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
});
