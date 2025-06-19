const mongoose = require("mongoose");

const sampleSchema = new mongoose.Schema(
  {
    sampleCode: String,
    type: String,
    parameters: Object,
    guestInfo: {
      name: String,
      email: String,
    },
    submittedBy: String,
    role: String,
    assignedLab: { type: String, required: true },
    collectedDate: { type: Date },
    location: { type: String },
    notes: { type: String },
    status: { type: String, default: "pending" },
    currentLab: String,
    report: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sample", sampleSchema);
