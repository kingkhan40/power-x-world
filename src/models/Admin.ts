import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  adminId: { type: String, default: "admin", unique: true },
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hash

});

// Avoid model overwrite in Next.js hot reload
export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export default Admin;
