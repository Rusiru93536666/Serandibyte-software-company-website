// src/app/api/contact/route.js
import ContactMessage from "../../models/ContactMessage";
import connectDB from "../../lib/mongodb";

export async function POST(req) {
  await connectDB();

  try {
    const { service, email, phone, company, message } = await req.json();

    if (!service || !email || !message) {
      return new Response(
        JSON.stringify({ message: "Please fill all required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newMessage = new ContactMessage({ service, email, phone, company, message });
    await newMessage.save();

    return new Response(
      JSON.stringify({ message: "Message saved successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error saving message:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
