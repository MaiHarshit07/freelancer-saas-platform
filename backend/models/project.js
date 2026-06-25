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
    assignedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attachments: [
      {
        url: String,
        publicId: String,
        originalName: String,
      },
    ],
  },

  {
    timestamps: true,
  },
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
// ******************************     to preventing overwriteModel error somehow even i havent initiated multiple schemas in this project but the error wont go so i have to do this will fixx this bug later        **********************************
//================= this can be because of two reasons either mongoose.model("A", f1)  and mongoose.model("A", f2) or also can be because of intiantiated schemas twice or more ===========
module.exports = Project;
