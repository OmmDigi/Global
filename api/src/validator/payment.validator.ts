import Joi from "joi";
import { LATE_FINE_FEE_HEAD_ID, MONTHLY_PAYMENT_HEAD_ID } from "../constant";

export const VCreateOrderValidator = Joi.object({
  form_id: Joi.number().required(),
  fee_structure_info: Joi.array()
    .items(
      Joi.object({
        fee_head_id: Joi.number().required(),
        custom_min_amount: Joi.number().required(),
        month: Joi.when("fee_head_id", {
          is: Joi.valid(MONTHLY_PAYMENT_HEAD_ID, LATE_FINE_FEE_HEAD_ID),
          then: Joi.required(),
          otherwise: Joi.optional().allow(null),
        }),
      }),
    )
    .min(1)
    .required(),
});

export const VAddPayment = Joi.object({
  form_id: Joi.number().required(),
  do_continue: Joi.boolean().optional().default(false),
  type: Joi.string().optional().valid("add", "update").default("add"),
  user_id: Joi.number().required(),
  fee_structure_info: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().optional().allow(null),
        fee_head_id: Joi.number().required(),
        custom_min_amount: Joi.number().required(),
        month: Joi.string().optional().allow(null),
        payment_date: Joi.string().optional().allow(null),
        payment_mode: Joi.string().optional().allow(null),
        bill_no: Joi.string().optional().allow(null),
        payment_details: Joi.string().optional().allow("").allow(null),
      }),
    )
    .min(1)
    .required(),
});

export const VDeletePayment = Joi.object({
  id: Joi.number().required(),
  form_id: Joi.number().required(),
  user_id: Joi.number().required().label("User Id"),
});

export const VCheckFine = Joi.object({
  pay_month: Joi.alternatives().try(
    Joi.string().pattern(/^\d{4}-\d{2}$/),
    Joi.array().items(Joi.string().pattern(/^\d{4}-\d{2}$/)),
  ),
  form_id: Joi.number().required(),
});

export const VGetPayments = Joi.object({
  mode: Joi.string().valid("Online", "Offline").default("Online"),
  from_date: Joi.string().optional().allow(null, ""),
  to_date: Joi.string().optional().allow(null, ""),
  page: Joi.number().default(1),
});

export const VUpdateBillNo = Joi.object({
  id: Joi.number().required(),
  bill_no: Joi.string().required().allow(""),
});
