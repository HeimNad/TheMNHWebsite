"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, PartyPopper } from "lucide-react";
import { bookingFormSchema, type BookingFormValues } from "./bookingForm";
import {
  StepIntro,
  StepContact,
  StepDetails,
  BookingSuccess,
} from "./BookingSteps";

const STEP_TITLES = ["Before You Book", "Contact Information", "Party Details"];

// Half-filled forms survive a closed tab, like Google Forms. Kept on the
// visitor's own device only, and dropped once it's stale or submitted.
const DRAFT_KEY = "mnh-party-booking-draft";
const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Has the visitor actually typed anything worth keeping? */
function hasContent(values: Partial<BookingFormValues>) {
  return Object.entries(values).some(([key, value]) => {
    if (key === "website") return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim() !== "";
    return Boolean(value);
  });
}

// Fields validated before leaving each step (step 0 is read-only info).
const STEP_FIELDS: (keyof BookingFormValues)[][] = [
  [],
  ["parentName", "phone", "email"],
  [
    "partyDate",
    "startTime",
    "packageType",
    "childCount",
    "childAge",
    "foodOptions",
    "pizzaPreference",
    "pizzaCount",
    "agreementAccepted",
    "waiverAcknowledged",
    "photoPermission",
  ],
];

export default function PartyBookingPage() {
  const [step, setStep] = useState(0);
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formLoadTime] = useState(() => Date.now());

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { addOns: [], foodOptions: [], specialRequests: "" },
  });

  const {
    handleSubmit,
    register,
    trigger,
    reset,
    watch,
    getValues,
    setFocus,
    getFieldState,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (
        Date.now() - draft.savedAt > DRAFT_MAX_AGE_MS ||
        !hasContent(draft.values ?? {})
      ) {
        localStorage.removeItem(DRAFT_KEY);
        return;
      }
      reset(draft.values);
      setStep(draft.step ?? 0);
      setRestoredDraft(true);
    } catch {
      // A blocked or corrupt store just means starting fresh.
    }
  }, [reset]);

  useEffect(() => {
    const save = (values: Partial<BookingFormValues>) => {
      try {
        if (!hasContent(values)) {
          localStorage.removeItem(DRAFT_KEY);
          return;
        }
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ savedAt: Date.now(), step, values })
        );
      } catch {
        // Private mode / full quota: the form still works, just without a draft.
      }
    };
    save(getValues());
    const subscription = watch(save);
    return () => subscription.unsubscribe();
  }, [watch, getValues, step]);

  const discardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    reset({ addOns: [], foodOptions: [], specialRequests: "" });
    setStep(0);
    setRestoredDraft(false);
  };

  const next = async () => {
    if (!(await trigger(STEP_FIELDS[step]))) {
      const firstInvalid = STEP_FIELDS[step].find(
        (field) => getFieldState(field).error
      );
      if (firstInvalid) setFocus(firstInvalid);
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: BookingFormValues) => {
    setErrorMessage("");
    try {
      const response = await fetch("/api/party-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _hp: data.website || "", _ts: formLoadTime }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to submit booking request");
      }

      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      setSubmittedEmail(data.email);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="bg-pink-50 min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-700 inline-flex items-center gap-3">
            <PartyPopper className="text-pink-500" />
            Party Booking Form
          </h1>
          <p className="text-pink-600 mt-2">The MNH Wonder Rides</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 sm:p-8">
          {submittedEmail ? (
            <BookingSuccess email={submittedEmail} />
          ) : (
            <>
              {restoredDraft && (
                <div className="mb-6 flex items-center justify-between gap-4 bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 text-sm text-pink-800">
                  <span>We brought back what you had already filled in.</span>
                  <button
                    type="button"
                    onClick={discardDraft}
                    className="font-semibold text-pink-600 hover:underline shrink-0"
                  >
                    Start over
                  </button>
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-pink-400 mb-2">
                  Step {step + 1} of {STEP_TITLES.length} · {STEP_TITLES[step]}
                </p>
                <div className="h-1.5 bg-pink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 transition-all duration-300"
                    style={{
                      width: `${((step + 1) / STEP_TITLES.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {step === 0 && <StepIntro />}
                {step === 1 && <StepContact form={form} />}
                {step === 2 && <StepDetails form={form} />}

                {/* Honeypot — hidden from humans, catnip for bots */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                  {...register("website")}
                />

                {errorMessage && (
                  <p className="mt-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                    {errorMessage}
                  </p>
                )}

                <div className="mt-8 flex items-center justify-between gap-4">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={back}
                      className="inline-flex items-center gap-2 text-pink-600 font-medium px-4 py-3 rounded-full hover:bg-pink-50 transition-colors"
                    >
                      <ArrowLeft size={18} /> Back
                    </button>
                  ) : (
                    <Link
                      href="/party"
                      className="inline-flex items-center gap-2 text-pink-600 font-medium px-4 py-3 rounded-full hover:bg-pink-50 transition-colors"
                    >
                      <ArrowLeft size={18} /> Packages
                    </Link>
                  )}

                  {step < STEP_TITLES.length - 1 ? (
                    <button
                      key="next"
                      type="button"
                      onClick={next}
                      className="inline-flex items-center gap-2 bg-pink-500 text-white font-bold px-8 py-3 rounded-full hover:bg-pink-600 transition-colors"
                    >
                      Next <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button
                      key="submit"
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 bg-pink-500 text-white font-bold px-8 py-3 rounded-full hover:bg-pink-600 transition-colors disabled:opacity-60"
                    >
                      {isSubmitting && (
                        <Loader2 size={18} className="animate-spin" />
                      )}
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
