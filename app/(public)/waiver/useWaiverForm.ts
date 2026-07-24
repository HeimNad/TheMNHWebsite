import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const waiverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  childName: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  termsAccepted: z.literal(true, {
    message: "You must accept the terms.",
  }),
  ageConfirmed: z.literal(true, {
    message: "You must confirm your age.",
  }),
  website: z.string().optional(), // Honeypot field
});

export type WaiverFormValues = z.infer<typeof waiverSchema>;

export function useWaiverForm() {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [formLoadTime] = useState(() => Date.now());

  const form = useForm<WaiverFormValues>({
    resolver: zodResolver(waiverSchema),
    defaultValues: {
      date: (() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      })(),
    },
  });

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const onSubmit = async (data: WaiverFormValues) => {
    setStatus({ type: null, message: "" });

    if (sigCanvas.current?.isEmpty()) {
      setStatus({
        type: "error",
        message: "Please sign the waiver before submitting.",
      });
      return;
    }

    setLoading(true);

    try {
      const signatureData = sigCanvas.current?.toData();

      const response = await fetch("/api/waiver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          child_name: data.childName || null,
          date: data.date,
          location: data.location,
          signature_data: signatureData,
          terms_accepted: data.termsAccepted,
          age_confirmed: data.ageConfirmed,
          _hp: data.website || "",
          _ts: formLoadTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit waiver");
      }

      setStatus({ type: "success", message: "Waiver submitted successfully!" });
      form.reset();
      clearSignature();
    } catch (error) {
      console.error("Error submitting waiver:", error);
      setStatus({
        type: "error",
        message:
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof (error as { message?: string }).message === "string"
            ? (error as { message: string }).message
            : "Failed to submit waiver. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { sigCanvas, loading, status, setStatus, clearSignature, onSubmit, ...form };
}
