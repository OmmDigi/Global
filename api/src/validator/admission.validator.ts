import Joi from "joi";

export const VCreateAdmission = Joi.object({
  // user_type: Joi.string().valid("new", "old").required(),
  admission_data: Joi.string().optional(),
  course_id: Joi.number().required().label("Course"),
  batch_id: Joi.number().required().label("Batch"),
  session_id: Joi.number().required().label("Session"),
  // payment_type : Joi.string().valid("Part Payment", "Full Payment").required()
});
