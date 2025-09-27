import mongoose from "mongoose";

// lecture progress schema
const lectureProgressSchema = new mongoose.Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: [true, "Lecture refrence is required"],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  watchTime: {
    type: Number,
    default: 0,
  },
  lastWatch: {
    type: Date,
    default: Date.now,
  },
});

// course progress schema
const courseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User refrence is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course refrence is required"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lectureProgress: [lectureProgressSchema],
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// update last accessed
courseProgressSchema.methods.updateLastAccess = function () {
  this.lastAccessed = Date.now();
  return this.save({ validateBeforeSave: false });
};
