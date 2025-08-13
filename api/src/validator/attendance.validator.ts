import Joi from "joi";

export const VAddAttendance = Joi.object({
  password: Joi.string().required(),
  data: Joi.array()
    .items(
      Joi.object({
        userId: Joi.number().required(),
        time: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
});

export const VSingleAttendance = Joi.object({
  id: Joi.number().required(),
  month_year : Joi.string().optional()
});
