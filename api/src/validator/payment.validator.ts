import Joi from "joi";

export const VCreateOrderValidator = Joi.object({
  form_id: Joi.number().required(),
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

export const VAddPayment = Joi.object({
  form_id: Joi.number().required(),
  payment_mode: Joi.string().required(),
  payment_details : Joi.string().required(),
  do_continue : Joi.boolean().optional().default(false),
  fee_structure_info: Joi.array()
    .items(
      Joi.object({
        fee_head_id: Joi.number().required(),
        custom_min_amount: Joi.number().required(),
        month: Joi.string().optional().allow(null),
        payment_date : Joi.string().optional().allow(null),
        bill_no : Joi.string().optional().allow(null)
      })
    )
    .min(1)
    .required(),
});

export const VDeletePayment = Joi.object({
  id : Joi.number().required(),
  form_id : Joi.number().required()
})