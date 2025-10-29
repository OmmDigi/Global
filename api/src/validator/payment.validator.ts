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
  do_continue : Joi.boolean().optional().default(false),
  type : Joi.string().required().valid("add", "update"),
  user_id : Joi.number().required(),
  fee_structure_info: Joi.array()
    .items(
      Joi.object({
        id : Joi.number().optional().allow(null),
        fee_head_id: Joi.number().required(),
        custom_min_amount: Joi.number().required(),
        month: Joi.string().optional().allow(null),
        payment_date : Joi.string().optional().allow(null),
        payment_mode : Joi.string().optional().allow(null),
        bill_no : Joi.string().optional().allow(null),
        payment_details : Joi.string().optional().allow("").allow(null)
      })
    )
    .min(1)
    .required(),
});

export const VDeletePayment = Joi.object({
  id : Joi.number().required(),
  form_id : Joi.number().required(),
  user_id : Joi.number().required().label("User Id")
})