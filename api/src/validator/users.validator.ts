import Joi from "joi";
import { USER_CATEGORY_TYPES } from "../constant";

export const VSingleUser = Joi.object({
  id: Joi.number().required(),
});

export const VGetUserList = Joi.object({
  fields: Joi.string().optional(),
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
});

export const VLoginUser = Joi.object({
  username: Joi.string().required().label("User name"),
  password: Joi.string().required(),
  category: Joi.string().required(),
});

export const VCreateUser = Joi.object({
  category: Joi.string()
    .required()
    .valid("Admin", "Teacher", "Stuff", "Student")
    .label("Category"),
  name: Joi.string().required().label("Name"),
  email: Joi.string().email().required().label("Email"),
  ph_no: Joi.string().required().label("Phone Number"),
  joining_date: Joi.string().optional().label("Joining Date"),
  designation: Joi.string().required().label("Designation"),
  description: Joi.string().optional().allow(""),
  image: Joi.string().optional().allow(""),
  password: Joi.string().required(),
  permissions: Joi.array().items(Joi.number()).required(),

  fee_structure_teacher: Joi.array().items(Joi.object({
    course_id: Joi.number().required(),
    amount: Joi.number().required(),
    workshop: Joi.number().optional(),
    extra: Joi.number().required(),
    type: Joi.string().required(),
    class_per_month: Joi.number().required()
  })),

  fee_structure_stuff: Joi.array().items(Joi.object({
    fee_head: Joi.string().required(),
    amount: Joi.number().required()
  }))
});

export const VUpdateUser = Joi.object({
  id: Joi.number().required(),
  category: Joi.string()
    .required()
    .valid("Admin", "Teacher", "Stuff", "Student")
    .label("Category"),
  name: Joi.string().required().label("Name"),
  email: Joi.string().email().required().label("Email"),
  ph_no: Joi.string().required().label("Phone Number"),
  joining_date: Joi.string().optional().label("Joining Date"),
  designation: Joi.string().required().label("Designation"),
  description: Joi.string().optional().allow(""),
  image: Joi.string().optional().allow(""),
  password: Joi.string().required(),
  permissions: Joi.array().items(Joi.number()).required(),

  fee_structure_teacher: Joi.array().items(Joi.object({
    course_id: Joi.number().required(),
    amount: Joi.number().required(),
    workshop: Joi.number().optional(),
    extra: Joi.number().required(),
    type: Joi.string().required(),
    class_per_month: Joi.number().required()
  })),

  fee_structure_stuff: Joi.array().items(Joi.object({
    fee_head: Joi.string().required(),
    amount: Joi.number().required()
  }))
});

export const VUpdateTeacherClassStatus = Joi.array().items(Joi.object({
  course_name: Joi.any().optional(),
  id: Joi.number().required(),
  regular: Joi.boolean().required(),
  workshop: Joi.boolean().required(),
  extra: Joi.number().required(),
}))
