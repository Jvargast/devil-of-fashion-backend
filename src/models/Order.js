const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      require: true,
    },
    region: {
      type: String,
      require: true,
    },
    commune: {
      type: String,
      require: true,
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        require: true,
      },
      price: {
        type: Number,
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
      image: {
        type: String,
        require: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        require: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  paymentInfo: {
    id: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
  },
  paidAt: {
    type: Date,
    require: true,
  },
  itemsPrice: {
    type: Number,
    require:true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    require:true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    require:true,
    default: 0,
  },
  orderStatus: {
    type: String,
    require: true,
    default: "En proceso"
  },
  deliveredAt: Date,
  createdAt: {
    type:Date,
    default:Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);