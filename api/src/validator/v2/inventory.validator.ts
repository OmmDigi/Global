import Joi from "joi";

export const VAddInventoryItemv2 = Joi.object({
  item_name: Joi.string().required(),
  minimum_quantity: Joi.string().required(),
  created_at: Joi.string().required(),
});

export const VAddInventoryItemStockv2 = Joi.object({
  item_id: Joi.number().required(),
  transaction_type: Joi.string().valid("add", "consume").required(),
  quantity: Joi.number().required(),

  vendors: Joi.array().items(
    Joi.object({
      vendor: Joi.number().required(),
      cost_per_unit: Joi.number().required(),
    })
  ),

  transaction_date: Joi.string().required(),
  remark: Joi.string().optional().allow(""),
});

export const VUpdateInventoryItemv2 = Joi.object({
  id : Joi.number().required(),
  item_name: Joi.string().required(),
  minimum_quantity: Joi.string().required(),
  created_at: Joi.string().required(),
});

export const VSingleInventoryItem = Joi.object({
  id : Joi.number().required()
})
