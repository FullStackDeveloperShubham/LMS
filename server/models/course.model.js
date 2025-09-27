const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Coursse title is required"],
      trim: true,
      maxLength: [100, "Course title cannont exceed 100 character"],
    },
    subTitle: {
      type: String,
      trim: true,
      maxLength: [200, "Course sub title cannont exceed 200 character"],
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Coursse category is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: {
        values: ["Beginner", "Intermediate", "Advanced"],
        MessageChannel: "Please select the valid course level",
      },
      default: "Beginner",
    },
    price: {
      type: Number,
      required: [true, "Course price required"],
      min: [0, "Course price must be a non-negatiive number"],
    },
    thumbnail: {
      type: String, // cloudinary url
      required: [true, "Course thumbnail is required"],
    },
    enrollStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lecture: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Course instructor is required"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalLecture: {
      type: Number,
      default: 0,
    },
  },
  {
    timestams: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual impliment
courseSchema.virtual("averageRating").get(function () {
  return 0;
});
