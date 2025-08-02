import Joi from "joi";

export const VCreateSession = Joi.object({
  name: Joi.string().required(),
});

export const VSingleSession = Joi.object({
  id: Joi.number().required(),
  fields: Joi.string().optional(),
});

export const VUpdateSession = Joi.object({
  id: Joi.number().required(),
  is_active: Joi.bool().optional(),
  name: Joi.string().optional(),
});

export const VGetSessionList = Joi.object({
  fields: Joi.string().optional(),
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  is_active: Joi.bool().optional(),
});

// fee head
export const VCreateFeeHead = Joi.object({
  name: Joi.string().required(),
});

export const VUpdateFeeHead = Joi.object({
  id: Joi.number().required(),
  is_active : Joi.bool().optional(),
  name: Joi.string().optional(),
});

// fee Structure
export const VSingleFeeStructure = Joi.object({
  id: Joi.number().required(),
});

export const VGetFeeStructure = Joi.object({
  course_id: Joi.number().required(),
});

export const VCreateFeeStructure = Joi.object({
  course_id: Joi.number().required(),
  fee_head_id: Joi.number().required(),
  amount: Joi.number().required(),
});

export const VUpdateFeeStructure = Joi.object({
  id: Joi.number().required(),
  course_id: Joi.number().optional(),
  fee_head_id: Joi.number().optional(),
  amount: Joi.number().optional(),
});

// Course Validator
export const VCreateCourse = Joi.object({
  name: Joi.string().required(),
  // payment_mode: Joi.string().valid("Cash", "Online").required(),
  duration: Joi.string().required(),
  // price: Joi.number().required(),
  // min_pay: Joi.number().required(),
  description: Joi.string().optional().allow(""),
  fee_structure: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().optional(),
        fee_head_id: Joi.number().required(),
        amount: Joi.number().required(),
      })
    )
    .required(),
});

export const VGetCourseList = Joi.object({
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  is_active: Joi.bool().optional(),
});

export const VUpdateCourse = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().optional(),
  // session_id: Joi.number().optional(),
  // payment_mode: Joi.string()
  //   .valid("UPI", "Cash", "Cash/UPI", "Cheque")
  //   .optional(),
  duration: Joi.string().optional(),
  // price: Joi.number().optional(),
  description: Joi.string().optional().allow(""),
  is_active: Joi.bool().optional(),

  fee_structure: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().optional(),
        fee_head_id: Joi.number().required(),
        amount: Joi.number().required(),
      })
    )
    .required(),
});

// Batches
export const VCreateBatches = Joi.object({
  course_id: Joi.number().required(),
  session_id: Joi.number().required(),
  month_names: Joi.array().items(Joi.string()).required(),
});
