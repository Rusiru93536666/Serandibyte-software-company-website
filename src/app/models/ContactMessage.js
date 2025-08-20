import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema({
  service: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  message: { type: String, required: true },
}, { timestamps: true });

const ContactMessage = mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
export default ContactMessage;
