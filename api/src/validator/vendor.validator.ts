import Joi from "joi";

export const addNewVendorValidator = Joi.object({
  name: Joi.string().required(),
  service_type: Joi.string().required(),
  address: Joi.string().required(),
  contact_details: Joi.string().required(),
});

export const addMultipleVendorItemValidator = Joi.array()
  .items(addNewVendorValidator)
  .required();

export const updateVendorValidator = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().optional(),
  service_type: Joi.string().optional(),
  address: Joi.string().optional(),
  contact_details: Joi.string().optional(),
});

export const deleteVendorValidator = Joi.object({
  id: Joi.number().required(),
});
