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
});

export const VUpdateUser = Joi.object({
  id: Joi.number().required(),
  category: Joi.string()
    .required()
    .valid(USER_CATEGORY_TYPES.join(", "))
    .label("Category"),
  name: Joi.string().required().label("Name"),
  email: Joi.string().email().required().label("Email"),
  ph_no: Joi.string().required().label("Phone Number"),
  joining_date: Joi.string().optional().label("Joining Date"),
  designation: Joi.string().required().label("Designation"),
  description: Joi.string().optional().allow(""),
  image: Joi.string().optional().allow(""),
  password: Joi.string().required(),
});
