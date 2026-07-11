"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { SiInstagram } from "@/components/icons/SiInstagram";
import { Suspense } from "react";
import { useContactForm } from "./useContactForm";
import { ContactSuccessMessage } from "./ContactSuccessMessage";
import { ContactFormFields } from "./ContactFormFields";

function ContactForm() {
  const {
    formData,
    setFormData,
    status,
    setStatus,
    errorMessage,
    captchaRef,
    HCAPTCHA_SITE_KEY,
    onCaptchaChange,
    onCaptchaError,
    handleSubmit,
  } = useContactForm();

  return (
    <div
      className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100 scroll-mt-24"
      id="contact-form"
    >
      <h2 className="text-2xl font-bold text-pink-700 mb-6">
        Send us a Message
      </h2>
      {status === "success" ? (
        <ContactSuccessMessage onReset={() => setStatus("idle")} />
      ) : (
        <ContactFormFields
          formData={formData}
          setFormData={setFormData}
          status={status}
          errorMessage={errorMessage}
          captchaRef={captchaRef}
          HCAPTCHA_SITE_KEY={HCAPTCHA_SITE_KEY}
          onCaptchaChange={onCaptchaChange}
          onCaptchaError={onCaptchaError}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default function ContactPage() {
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
            <h2 className="text-3xl font-bold text-pink-700 mb-6">
              Contact Information
            </h2>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="text-pink-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-pink-700 mb-1">
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
                <h3 className="text-lg font-semibold text-pink-700 mb-1">
                  Call Us
                </h3>
                <p className="text-pink-700">+1 (516) 423-6988</p>
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
                <h3 className="text-lg font-semibold text-pink-700 mb-1">
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

            {/* Instagram */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
                <SiInstagram className="text-pink-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-pink-700 mb-1">
                  Follow Us
                </h3>
                <a
                  href="https://www.instagram.com/themnhwonderrides/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-700 hover:underline"
                >
                  @themnhwonderrides
                </a>
                <p className="text-sm text-pink-600 mt-1">
                  See our latest rides and events!
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form with Suspense Boundary */}
          <Suspense
            fallback={
              <div className="bg-white p-8 rounded-2xl h-96 animate-pulse" />
            }
          >
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
