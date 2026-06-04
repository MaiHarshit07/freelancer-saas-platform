const mongoose = require("mongoose");
// it is for the project list including things like title and description and status of the project
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
    },

    skills: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  {
    timestamps: true,
  },
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
