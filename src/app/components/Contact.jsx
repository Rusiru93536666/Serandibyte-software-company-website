'use client'

import React, { useState } from 'react'

// ---------------------------------------------------------------------
// CONTACT SECTION
// `data`     = page_content('home').contact (heading/description copy)
// `settings` = public settings (contact_website/contact_phone/contact_email)
// Form submission already writes to `contact_messages` via /api/contact —
// unchanged, only the surrounding copy and contact details are now dynamic.
// ---------------------------------------------------------------------

const SERVICES = ["Website", "Software", "Design"];

export default function Contact({ data = {}, settings = {}, showAlert }) {
  const { heading = 'Contact us', description = '' } = data;
  const {
    contact_website: contactWebsite = '',
    contact_phone: contactPhone = '',
    contact_email: contactEmail = '',
  } = settings;

  const [service, setService] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!service || !fullName || !email || !message) {
      showAlert("error", "Please fill all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service,
          fullName,
          email,
          phone,
          company,
          message,
        }),
      });

      const data = await res.json();

      showAlert(res.ok ? "success" : "error", data.message);

      // Clear form
      setService(null);
      setFullName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("error", "Failed to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative bg-black overflow-hidden pl-[10vw] px-10 py-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-25 items-start  bg-black ">
        {/* ------------------------------------------------------------ */}
        {/* LEFT: intro copy + contact details + map                     */}
        {/* ------------------------------------------------------------ */}
        <div className="flex flex-col">
          <div className="w-14 h-14 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_25px_rgba(59,130,246,0.25)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6"
            >
              <path
                d="M3 6.5C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
                fill="#3B82F6"
              />
              <path
                d="m4 6 8 6 8-6"
                stroke="#0A0A0A"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight">
            {heading}
          </h2>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-md mb-10">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm sm:text-base text-gray-300 mb-14">
            {contactWebsite && (
              <span className="hover:text-white transition">{contactWebsite}</span>
            )}
            {contactPhone && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-600 hidden sm:block" />
                <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="hover:text-white transition">
                  {contactPhone}
                </a>
              </>
            )}
            {contactEmail && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-600 hidden sm:block" />
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition">
                  {contactEmail}
                </a>
              </>
            )}
          </div>

          <WorldMap />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT: floating form card                                     */}
        {/* ------------------------------------------------------------ */}
        <div className="w-full rounded-[28px]  bg-black border border-white/10 backdrop-blur-xl bg-white/[0.04] shadow-[0_0_40px_rgba(0,229,255,0.12)] p-8 sm:p-10">
          {/* service selector — kept at the top of the form */}
          <label className="text-gray-200 text-sm font-medium mb-2 block">
            I need a
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
            {SERVICES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setService(s)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition backdrop-blur ${
                  service === s
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white border-white/15 hover:bg-white/10"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <Field
            label="Full name"
            value={fullName}
            onChange={setFullName}
            placeholder="Manu Arora"
          />

          <Field
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="contact@aceternity.com"
          />

          <Field
            label="Mobile Number"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="xxx xxx xxxx"
          />

          <Field
            label="Business"
            value={company}
            onChange={setCompany}
            placeholder="Aceternity Labs LLC"
          />

          <label className="text-gray-200 text-sm font-medium mb-2 block mt-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition"
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full px-4 py-3.5 rounded-xl bg-white text-black font-bold shadow hover:bg-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending..." : "Submit"}
          </button>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="mb-6">
      <label className="text-gray-200 text-sm font-medium mb-2 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
      />
    </div>
  );
}

function WorldMap() {
  return (
    <div className="relative w-full max-w-xl aspect-[2/1] select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/world.png"
        alt="map"
        className="absolute inset-0 w-full h-full object-contain opacity-70"
        draggable={false}
      />
    </div>
  );
}
