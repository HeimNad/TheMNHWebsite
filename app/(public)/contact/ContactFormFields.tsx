import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  childAge: string;
  preferredContact: string;
  subject: string;
  message: string;
};

export function ContactFormFields({
  formData,
  setFormData,
  status,
  errorMessage,
  captchaRef,
  HCAPTCHA_SITE_KEY,
  onCaptchaChange,
  onCaptchaError,
  handleSubmit,
}: {
  formData: FormData;
  setFormData: (data: FormData) => void;
  status: "idle" | "submitting" | "success" | "error";
  errorMessage: string;
  captchaRef: React.RefObject<HCaptcha | null>;
  HCAPTCHA_SITE_KEY: string;
  onCaptchaChange: (token: string) => void;
  onCaptchaError: (err: any) => void;
  handleSubmit: (e: FormEvent) => void;
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-pink-700 mb-2"
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
            className="block text-sm font-medium text-pink-700 mb-2"
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

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-pink-700 mb-2"
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
            htmlFor="phone"
            className="block text-sm font-medium text-pink-700 mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="childAge"
            className="block text-sm font-medium text-pink-700 mb-2"
          >
            Child&apos;s Age{" "}
            <span className="text-gray-400 text-xs font-normal">
              (Optional)
            </span>
          </label>
          <select
            id="childAge"
            value={formData.childAge}
            onChange={(e) =>
              setFormData({ ...formData, childAge: e.target.value })
            }
            className="w-full pl-3 pr-8 py-3 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">Select Age</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5">5 years</option>
            <option value="6-12">6-12 years</option>
            <option value="12+">12+ years</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="preferredContact"
            className="block text-sm font-medium text-pink-700 mb-2"
          >
            Preferred Contact Method
          </label>
          <select
            id="preferredContact"
            value={formData.preferredContact}
            onChange={(e) =>
              setFormData({ ...formData, preferredContact: e.target.value })
            }
            className="w-full pl-3 pr-8 py-3 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="email">Email Only</option>
            <option value="sms">SMS Only</option>
            <option value="both">Both SMS & Email</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-pink-700 mb-2"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          required
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
          placeholder="General Inquiry"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-pink-700 mb-2"
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
  );
}
