import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  adminId: { type: String, default: "admin", unique: true },
  name: { type: String, default: "" },
  email: { type: String, default: "" },
});

export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
