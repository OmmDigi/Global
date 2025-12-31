import Joi from "joi";

export const VPaymentReport = Joi.object({
  from_date: Joi.string().required(),
  to_date: Joi.string().required(),
  course: Joi.number().required(),
  batch: Joi.number().required(),
  mode: Joi.string().valid("Online", "Cash", "Cheque").required(),
  token: Joi.string().optional()
});

export const VGenerateUrl = Joi.object({
  type: Joi.string().valid("payment_report", "admission_report", "salary_sheet", "inventory_report", "monthly_payment_report", "fee_summary_report", "total_amount_report").required(),
  query: Joi.string().required()
});

export const VInventoryReport = Joi.object({
  from_date: Joi.string().required().label("Start Date"),
  to_date: Joi.string().required().label("End Date"),
  token: Joi.string().optional()
});

export const VGetNewAdmissionReport = Joi.object({
  batch: Joi.number().required(),
  // from_date: Joi.string().required(),
  // to_date: Joi.string().required(),
  session : Joi.number().required(),
  mode : Joi.string().valid("Cash", "Online", "Both").required(),
  course: Joi.number().required(),
  token: Joi.string().required()
})

export const VMonthlyPaymentReport = Joi.object({
  batch: Joi.number().required(),
  from_date: Joi.string().required(),
  to_date: Joi.string().required(),
  course: Joi.number().required(),

  session : Joi.number().optional(),
  mode : Joi.string().valid("Cash", "Online", "Both").required(),

  token: Joi.string().required()
})

export const VFeeSummaryReport = Joi.object({
  batch: Joi.number().required(),
  // from_date: Joi.string().required(),
  // to_date: Joi.string().required(),
  course: Joi.number().required(),

  session : Joi.number().required(),
  mode : Joi.string().valid("Cash", "Online", "Both").required(),
  
  token: Joi.string().required()
})

export const VTotalPaymentReport = Joi.object({
  course : Joi.number().optional(),
  from_date : Joi.string().required(),
  to_date : Joi.string().required(),
  mode : Joi.string().optional(),
  token : Joi.string().required()
})