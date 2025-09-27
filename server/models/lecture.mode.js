import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lecture title is required"],
      trim: true,
      maxLength: [100, "Lecture title cannont exceed 100 character"],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, "Lecture description cannont exceed 500 character"],
    },
    videoUrl: {
      type: String,
      required: [true, "Video url is required"],
    },
    duration: {
      type: Number,
      default: 0,
    },
    publicId: {
      type: String,
      required: [true, "Public id is required"],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: [true, "Lecture order is required"],
    },
  },
  {
    timestams: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
