import Joi from "joi";

export const VAddInventoryItemv2 = Joi.object({
  item_name: Joi.string().required(),
  minimum_quantity: Joi.string().required(),
  created_at: Joi.string().required(),
});

export const VAddInventoryItemStockv2 = Joi.object({
  item_id: Joi.number().required(),
  transaction_type: Joi.string().valid("add", "consume").required(),

  vendors: Joi.array().items(
    Joi.object({
      vendor: Joi.number().when("transaction_type", {
        is: "add",
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      cost_per_unit: Joi.number().required(),
      quantity: Joi.number().required(),
    })
  ),

  receivers: Joi.array().items(
    Joi.object({
      receiver_type: Joi.string().when("transaction_type", {
        is: "consume",
        then: Joi.valid("student", "employee", "custom").required(),
        otherwise: Joi.optional(),
      }),
      receiver_value: Joi.string().when("transaction_type", {
        is: "consume",
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      bill_no: Joi.string().optional(),
      quantity: Joi.number().required(),
    })
  ),

  vendor_id: Joi.number().when("transaction_type", {
    is: "consume",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  transaction_date: Joi.string().required(),
  remark: Joi.string().optional().allow(""),
});

export const VUpdateInventoryItemv2 = Joi.object({
  id: Joi.number().required(),
  item_name: Joi.string().required(),
  minimum_quantity: Joi.number().required(),
  created_at: Joi.string().required(),
});

export const VSingleInventoryItem = Joi.object({
  id: Joi.number().required(),
});
