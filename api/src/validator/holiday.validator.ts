import Joi from "joi";

export const VCreateHoliday = Joi.object({
  holiday_name: Joi.string().required(),
  date: Joi.string().required(),
});

export const VUpdateHoliday = Joi.object({
  id: Joi.number().required(),
  holiday_name: Joi.string().required(),
  date: Joi.string().required(),
});

export const VDeleteHoliday = Joi.object({
  id: Joi.number().required(),
});