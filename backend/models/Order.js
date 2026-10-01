import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        image: String,
        price: Number,
        quantity: Number
      }
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: { type: String, default: "COD" },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Placed", "Processing", "Shipped", "Delivered"],
      default: "Placed"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
