import Joi from "joi";

export const VPaymentReport = Joi.object({
  from_date: Joi.string().required(),
  to_date: Joi.string().required(),
  course: Joi.number().required(),
  batch: Joi.number().required(),
  mode: Joi.string().valid("Online", "Cash", "Cheque").required(),
  token : Joi.string().optional()
});

export const VGenerateUrl = Joi.object({
  type: Joi.string().valid("payment_report", "admission_report", "salary_sheet", "inventory_report").required(),
  query : Joi.string().required()
});

export const VInventoryReport = Joi.object({
  from_date: Joi.string().required().label("Start Date"),
  to_date: Joi.string().required().label("End Date"),
  token : Joi.string().optional()
});