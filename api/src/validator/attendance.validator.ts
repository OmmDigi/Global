import Joi, { number } from "joi";
import { VUpdateTeacherClassStatus } from "./users.validator";

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
  month_year: Joi.string().optional()
});

export const VEditTeacherClassStatus = Joi.object({
  id : Joi.number().required(),
  name : Joi.string().optional(),
  date:Joi.string().optional(),
  for_courses : VUpdateTeacherClassStatus
})

export const VGetTeacherClassList = Joi.object({
  date : Joi.string().optional()
})