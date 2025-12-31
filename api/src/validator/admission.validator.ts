import Joi from "joi";

export const VCreateAdmission = Joi.object({
  // user_type: Joi.string().valid("new", "old").required(),
  admission_data: Joi.string().optional(),
  course_id: Joi.number().required().label("Course"),
  batch_id: Joi.number().required().label("Batch"),
  session_id: Joi.number().required().label("Session"),
  declaration_status: Joi.number().optional(),
  admission_from: Joi.string().valid("crm", "website").required(),
  // payment_type : Joi.string().valid("Part Payment", "Full Payment").required()
});

export const VGetSingleAdmission = Joi.object({
  form_id: Joi.number().required(),
});

export const VGetSingleAdmissionForm = Joi.object({
  form_id: Joi.number().required(),
});

export const VUpdateAdmission = Joi.object({
  form_id: Joi.number().required(),
  admission_data: Joi.string().required(),
});

export const VUpdateAdmissionStatus = Joi.object({
  form_id: Joi.number().required(),
  form_status: Joi.boolean().required(),
});

export const VGetAdmissionList = Joi.object({
  student_id: Joi.number().optional(),
  // from_date: Joi.string().optional(),
  // to_date: Joi.string().optional(),

  course: Joi.number().optional(),
  batch: Joi.number().optional(),
  session: Joi.number().optional(),
  fee_head_id: Joi.number().optional(),

  form_no: Joi.string().optional(),
  ph_no: Joi.string().optional(),
  email: Joi.string().email().optional(),
  name: Joi.string().optional(),
  page: Joi.number().optional(),
  token: Joi.string().optional(),
  limit: Joi.number().optional(),
  ["select-all"]: Joi.bool().optional(),
});

export const VUpdateDeclarationStatus = Joi.object({
  form_id: Joi.number().required(),
  // declaration_status: Joi.number().valid(0, 1).required()
});

export const VGetSessionCourseHeadPrice = Joi.object({
  session_id: Joi.number().required(),
  course_id: Joi.number().required(),
  fee_head_id: Joi.number().required(),
  batch_id: Joi.number().optional(),
});

export const VUpdateSessionCourseHeadPrice = Joi.object({
  session_id: Joi.number().required(),
  fee_head_id: Joi.number().required(),
  course_id: Joi.number().required(),
  batch_id: Joi.number().optional(),

  previous_amount: Joi.number().required(),
  current_amount: Joi.number().required(),
});

export const VModifyAdmissionFeeHead = Joi.object({
  form_id: Joi.number().required(),
  fee_head_id: Joi.number().required(),
  amount: Joi.number().required(),
});

export const VDeleteSingleAdmission = Joi.object({
  form_id: Joi.number().required(),
  fee_head_id: Joi.number().required(),
});

export const VPromotAdmisson = Joi.object({
  student_ids: Joi.array().items(Joi.number()),
  course_id: Joi.number().required().label("Course"),
  batch_id: Joi.number().required().label("Batch"),
  session_id: Joi.number().required().label("Session"),
});

export const VChangeStudentAdmissionCourse = Joi.object({
  form_ids: Joi.array().items(Joi.number()).required(),
  course_id: Joi.number().required().label("Course"),
  batch_id: Joi.number().required().label("Batch"),
  session_id: Joi.number().required().label("Session"),
});
