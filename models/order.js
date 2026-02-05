const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerId: mongoose.Schema.Types.ObjectId,
    orderItems: Array,
    totalAmount: Number,
    orderStatus: String,
    orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
