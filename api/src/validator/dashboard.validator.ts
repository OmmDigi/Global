import Joi from "joi";

export const VYearlyAdmission = Joi.object({
  year: Joi.string().optional(),
});

export const VMonthlyIncome = Joi.object({
  from_date: Joi.string().optional(),
  to_date: Joi.string().optional(),
});

export const VPerDayAttendance = Joi.object({
  date: Joi.string().optional(),
});
