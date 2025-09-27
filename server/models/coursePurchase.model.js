import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course refrence is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User refrence is required"],
    },
    amount: {
      type: Number,
      required: [true, "Purchase amount is required"],
      min: [0, "Amount must be non-negative"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      uppercase: true,
      default: "USD",
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Completed", "Failed", "Refunded"],
        message: "Please select a valid status",
      },
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
    },
    paymentId: {
      type: String,
      required: [true, "Payment ID is required"],
    },
    refundId: {
      type: String,
    },
    refundedAmount: {
      type: Number,
      min: [0, "Refunded amount must be non-negative"],
    },
    refundReason: {
      type: String,
    },
    metaData: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// added indexes
coursePurchaseSchema.index({ user: 1, course: 1 });
coursePurchaseSchema.index({ status: 1 });
coursePurchaseSchema.index({ createdAt: -1 });

// virtuals
coursePurchaseSchema.virtual("isRefundable").get(function () {
  if (this.status !== "Completed") return false;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 1000);
  return this.createdAt > thirtyDaysAgo;
});

// method process refund
coursePurchaseSchema.methods.processRefund = async function (reason, amount) {
  this.status = "Refunded";
  this.reason = reason;
  this.refundedAmount = amount || this.amount;
  return this.save();
};

export const CoursePurchase = mongoose.model(
  "CoursePurchase",
  coursePurchaseSchema
);
