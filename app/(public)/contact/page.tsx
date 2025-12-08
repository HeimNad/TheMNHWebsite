"use client";

import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useState, useRef, FormEvent } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const captchaRef = useRef<HCaptcha>(null);

  const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "";

  const onCaptchaChange = (token: string) => {
    setCaptchaToken(token);
    setErrorMessage("");
  };

  const onCaptchaError = (err: any) => {
    console.error("hCaptcha Error:", err);
    setErrorMessage("Captcha verification failed. Please try again.");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!captchaToken) {
      setErrorMessage("Please complete the security check.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, captchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "Something went wrong. Please try again later.");
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    }
  };

  return (
    <div className="bg-pink-50 min-h-screen pt-16 pb-16">
      {/* Hero Section */}
      <section className="bg-pink-100/50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-pink-500 mb-6">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-pink-700 max-w-2xl mx-auto">
            Have a question? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-pink-900 mb-6">
              Contact Information
            </h2>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="text-pink-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-pink-900 mb-1">
                  Email Us
                </h3>
                <p className="text-pink-700">themnhwonderrides@gmail.com</p>
                <p className="text-sm text-pink-600 mt-1">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
                <Phone className="text-pink-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-pink-900 mb-1">
                  Call Us
                </h3>
                <p className="text-pink-700">+1 (516) 373-1319</p>
                <p className="text-sm text-pink-600 mt-1">
                  Mon-Sat from 10am to 9pm.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="text-pink-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-pink-900 mb-1">
                  Visit Us
                </h3>
                <p className="text-pink-700">
                  1500 Old Country Rd, Westbury, NY 11590
                </p>
                <p className="text-pink-700">
                  522 Broadway Mall, Hicksville, NY 11801
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100">
            <h2 className="text-2xl font-bold text-pink-900 mb-6">
              Send us a Message
            </h2>
            {status === "success" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-pink-900 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-pink-900 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-pink-900 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-pink-900 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                {/* hCaptcha */}
                <div className="flex justify-center">
                  <HCaptcha
                    sitekey={HCAPTCHA_SITE_KEY}
                    onVerify={onCaptchaChange}
                    onError={onCaptchaError}
                    ref={captchaRef}
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-pink-500 text-white font-medium py-3 rounded-lg hover:bg-pink-600 transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
