import ContactMessage from "../models/ContactMessage";

export async function saveMessage(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json(); // parse JSON body
    const { service, email, phone, company, message } = body;

    const newMessage = new ContactMessage({ service, email, phone, company, message });
    await newMessage.save();

    return new Response(JSON.stringify({ message: "Message saved successfully!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
