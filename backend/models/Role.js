  // models/Role.js
  const mongoose = require("mongoose");

  const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },

    permissions: {
      user_add: { type: Boolean, default: false },
      user_edit: { type: Boolean, default: false },
      user_delete: { type: Boolean, default: false },
      user_view: { type: Boolean, default: false },

      category_add: { type: Boolean, default: false },
      category_edit: { type: Boolean, default: false },
      category_delete: { type: Boolean, default: false },
      category_view: { type: Boolean, default: false },

      customer_add: { type: Boolean, default: false },
      customer_edit: { type: Boolean, default: false },
      customer_delete: { type: Boolean, default: false },
      customer_view: { type: Boolean, default: false },

      product_add: { type: Boolean, default: false },
      product_edit: { type: Boolean, default: false },
      product_delete: { type: Boolean, default: false },
      product_view: { type: Boolean, default: false },
    },
  });

  module.exports = mongoose.model("Role", roleSchema);