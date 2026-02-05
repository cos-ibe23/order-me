const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Customer", customerSchema);
