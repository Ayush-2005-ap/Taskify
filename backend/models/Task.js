const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum:['Pending','Completed'], default: "Pending" },
  priority: { type: String, enum:['Low','Medium','High'], default: "Medium" },
  deadline: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
