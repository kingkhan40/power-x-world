// src/models/Admin.ts
import mongoose, { Schema, models } from "mongoose";

const adminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hash
});

const Admin = models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;
