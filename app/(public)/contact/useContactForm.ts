import { useState, useRef, FormEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  childAge: "",
  preferredContact: "email",
  subject: "",
  message: "",
};

export function useContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState(emptyForm);
  const captchaTokenRef = useRef<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const captchaRef = useRef<HCaptcha>(null);

  const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "";

  useEffect(() => {
    const subjectParam = searchParams.get("subject");
    if (subjectParam) {
      setFormData((prev) => ({ ...prev, subject: subjectParam }));
    }
  }, [searchParams]);

  const onCaptchaChange = (token: string) => {
    captchaTokenRef.current = token;
    setErrorMessage("");
  };

  const onCaptchaError = (err: any) => {
    console.error("hCaptcha Error:", err);
    setErrorMessage("Captcha verification failed. Please try again.");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!captchaTokenRef.current) {
      setErrorMessage("Please complete the security check.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          captchaToken: captchaTokenRef.current,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setFormData(emptyForm);
      captchaTokenRef.current = null;
      captchaRef.current?.resetCaptcha();
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMessage(
        error.message || "Something went wrong. Please try again later."
      );
      captchaRef.current?.resetCaptcha();
      captchaTokenRef.current = null;
    }
  };

  return {
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
  };
}
