"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle } from "lucide-react";

// Define Zod schema
const waiverSchema = z.object({
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

type WaiverFormValues = z.infer<typeof waiverSchema>;

export default function WaiverPage() {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [formLoadTime] = useState(() => Date.now());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaiverFormValues>({
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
          _hp: data.website || "",
          _ts: formLoadTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit waiver");
      }

      setStatus({ type: "success", message: "Waiver submitted successfully!" });
      reset(); // Reset React Hook Form fields
      clearSignature(); // Clear canvas
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

  return (
    <div className="bg-pink-50 min-h-screen pt-16 pb-16">
      {/* Header Section */}
      <section className="bg-pink-100/50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-pink-900 mb-6">
            WAIVER AND RELEASE OF LIABILITY
          </h1>
          <p className="text-lg sm:text-xl text-pink-700 font-medium">
            The MNH Wonder Rides
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Notice & Rules */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-8 mb-8 space-y-6">
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
            <p className="text-pink-900 font-medium text-sm">
              <span className="font-bold">NOTICE:</span> This Waiver and Release
              of Liability Agreement is a legal document that limits and affects
              your rights. Please read carefully before submitting.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-pink-900 mb-4">
              The MNH Wonder Rides Rules
            </h2>
            <ul className="space-y-2 text-pink-800 list-disc pl-5">
              <li>
                Riders under 4 ft. must be accompanied on all rides by an adult
              </li>
              <li>Max weight limit: 250 lbs per animal ride</li>
              <li>No food or drinks while riding</li>
              <li>
                Riders may not go into stores or exit the mall during the ride
              </li>
              <li>No bumping into people or other riders</li>
              <li>All children must be supervised by an adult</li>
            </ul>
          </div>

          <div className="space-y-4 text-pink-800 text-sm leading-relaxed">
            <p>
              This Personal Injury Waiver (“Waiver”) is made by the undersigned
              for the purpose of participating in ride activities operated by
              The MNH Company LLC (the “Company”). The undersigned acknowledges
              and accepts that there are inherent risks of personal injury
              related to the use of the ride-on animals provided.
            </p>
            <p>
              In consideration of being allowed to participate in these
              activities at the selected location (listed below), the
              undersigned voluntarily assumes all known and unknown risks and
              agrees to release, discharge, and hold harmless the Company, its
              owners, staff, affiliates, and partners from any and all claims,
              liabilities, damages, or losses arising from participation,
              including but not limited to any injuries, theft, accidents, or
              negligence.
            </p>
            <p>
              This Waiver shall be binding upon the undersigned and their heirs,
              legal representatives, successors, and assigns. If any portion of
              this Waiver is deemed invalid, the remaining provisions shall
              remain fully enforceable.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-8">
          {status.type === "success" ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Waiver Submitted Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for completing the waiver. You are now ready to ride!
              </p>
              <button
                onClick={() => setStatus({ type: null, message: "" })}
                className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
              >
                Sign another waiver
              </button>
            </div>
          ) : (
            <>
              {status.message && status.type === "error" && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
                  {status.message}
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                {/* Honeypot field - hidden from humans, bots will fill it */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input
                    {...register("website")}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-pink-900 mb-2"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      id="name"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? "border-red-500" : "border-pink-200"
                      } focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all`}
                      placeholder="Full Name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="childName"
                      className="block text-sm font-medium text-pink-900 mb-2"
                    >
                      Child&apos;s Name{" "}
                      <span className="text-pink-400 text-xs">
                        (if applicable)
                      </span>
                    </label>
                    <input
                      {...register("childName")}
                      type="text"
                      id="childName"
                      className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                      placeholder="Child's Full Name"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-pink-900 mb-2"
                    >
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("date")}
                      type="date"
                      id="date"
                      className={`w-full px-4 py-3 rounded-lg border appearance-none min-w-0 bg-white ${
                        errors.date ? "border-red-500" : "border-pink-200"
                      } focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-pink-900`}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-pink-900 mb-2"
                    >
                      Location of Participation{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("location")}
                      id="location"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.location ? "border-red-500" : "border-pink-200"
                      } focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all bg-white text-pink-900`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a location
                      </option>
                      <option value="Samanea New York">
                        Samanea New York, Westbury, NY
                      </option>
                      <option value="Broadway Commons">
                        Broadway Commons, Hicksville, NY
                      </option>
                    </select>
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pink-900 mb-2">
                    Signature <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-pink-200 rounded-lg overflow-hidden bg-white">
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="#831843"
                      canvasProps={{
                        className: "w-full h-40 bg-pink-50/20 cursor-crosshair",
                      }}
                    />
                    <div className="bg-pink-50 border-t border-pink-100 px-4 py-2 flex justify-end">
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="text-xs text-pink-600 hover:text-pink-800 font-medium px-2 py-1 rounded hover:bg-pink-100 transition-colors"
                      >
                        Clear Signature
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-pink-500 mt-1">
                    Please sign in the box above.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-pink-100">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      {...register("termsAccepted", { required: true })}
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm text-pink-800 group-hover:text-pink-900 transition-colors">
                      I confirm that I have read and agree to the above waiver
                      and release of liability.
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-red-500 text-xs ml-7">
                      {errors.termsAccepted.message}
                    </p>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      {...register("ageConfirmed", { required: true })}
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm text-pink-800 group-hover:text-pink-900 transition-colors">
                      I am 18 years old or am signing on behalf of a minor
                      participant.
                    </span>
                  </label>
                  {errors.ageConfirmed && (
                    <p className="text-red-500 text-xs ml-7">
                      {errors.ageConfirmed.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-pink-500 text-white font-bold py-4 rounded-lg hover:bg-pink-600 transition-colors shadow-sm mt-4 text-lg cursor-pointer ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Submitting..." : "Submit Waiver"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
