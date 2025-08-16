import Joi from "joi";

export const VMultiInvertoryItemAdd = Joi.array().items(
  Joi.object({
    item_name: Joi.string().required(),

    where_to_use: Joi.string().optional().allow(""),
    used_by: Joi.string().optional().allow(""),
    description: Joi.string().optional().allow(""),

    minimum_quantity: Joi.number().required(),

    created_at: Joi.string().required().label("Item Addition Date"),

    vendor_id: Joi.number().required(),
  })
);

export const VUPdateSingleInventoryItemInfo = Joi.object({
  item_id: Joi.number().required(),

  item_name: Joi.string().optional(),

  where_to_use: Joi.string().optional().allow(""),
  used_by: Joi.string().optional().allow(""),
  description: Joi.string().optional().allow(""),

  minimum_quantity: Joi.number().optional(),

  vendor_id: Joi.number().optional(),

  created_at: Joi.string().optional().label("Item Addition Date"),
});

export const VMultiInvertoryStockAdd = Joi.array().items(
  Joi.object({
    item_id: Joi.number().required(),

    transaction_type: Joi.string().valid("add", "consume").required(),
    quantity: Joi.number().required(),
    quantity_status: Joi.string().optional().allow(""),

    transaction_date: Joi.string().required(),

    cost_per_unit: Joi.number().required(),

    // total_value: Joi.number().required(),

    remark: Joi.string().optional().allow(""),
  })
);
