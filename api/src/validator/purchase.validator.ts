import Joi from "joi";

export const VAddPurchase = Joi.object({
  file: Joi.string().optional(),
  name: Joi.string().required(),
  bill_no: Joi.string().optional().allow(""),
  per_item_rate: Joi.number().required(),
  company_details: Joi.string().optional().allow(""),
  purchase_date: Joi.string().required(),
  expaire_date: Joi.string().optional(),
  previousBalance: Joi.number().optional(),
  presentBalance: Joi.number().required(),
  quantityReceived: Joi.number().required(),
  description: Joi.string().optional(),
});

export const VUpdatePurchase = Joi.object({
  id: Joi.number().required(),
  file: Joi.string().optional(),
  name: Joi.string().optional(),
  bill_no: Joi.string().optional().allow(""),
  per_item_rate: Joi.number().optional(),
  company_details: Joi.string().optional().allow(""),
  purchase_date: Joi.string().optional(),
  expaire_date: Joi.string().optional(),
  previousBalance: Joi.number().optional(),
  presentBalance: Joi.number().optional(),
  quantityReceived: Joi.number().optional(),
  description: Joi.string().optional(),
});

export const VSingleValidator = Joi.object({
  id: Joi.number().required(),
});
