import Joi from "joi";

export const VCreateLeave = Joi.object({
  employee_id: Joi.number().required(),
  from_date: Joi.string().required(),
  to_date: Joi.string().required(),
  reason: Joi.string().required(),
});

export const VSingleLeave = Joi.object({
  id: Joi.number().required(),
});

export const VUpdateLeaveStatus = Joi.object({
  id : Joi.number().required(),
  status: Joi.string().valid("Approved", "Rejected").required(),
  employee_id: Joi.number().required(),
});
