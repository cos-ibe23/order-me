const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

/* ======================
   Middleware
====================== */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ======================
   MongoDB Connection
====================== */
mongoose
  .connect("mongodb://localhost:27017/orderDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

/* ======================
   Schemas & Models
====================== */
const customerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String
});
const Customer = mongoose.model("Customer", customerSchema);

const orderSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  orderItems: Array,
  totalAmount: Number,
  orderStatus: String,
  orderDate: {
    type: Date,
    default: Date.now
  }
});
const Order = mongoose.model("Order", orderSchema);

/* ======================
   Routes
====================== */

// Home Route
app.get("/", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await Customer.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Customer({
      name,
      email,
      password: hashedPassword,
      phone
    });

    await user.save();
    res.json({ success: true, message: "Signup successful", customerId: user._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Customer.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, message: "Login successful", customerId: user._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Place Order
app.post("/place-order", async (req, res) => {
  try {
    const { customerId, productName, quantity, price } = req.body;

    if (!customerId || !productName || !quantity || !price) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const totalAmount = quantity * price;

    const newOrder = new Order({
      customerId,
      orderItems: [{ productName, quantity, price }],
      totalAmount,
      orderStatus: "Placed"
    });

    await newOrder.save();
    res.json({ success: true, message: "Order placed successfully", orderId: newOrder._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
});

/* ======================
   Start Server
====================== */
app.listen(3000, () => {
  console.log("Server running on port 3000 🚀");
});

