import SignatureCanvas from "react-signature-canvas";
import { RefObject } from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import type { WaiverFormValues } from "./useWaiverForm";

export function WaiverFormFields({
  register,
  errors,
  handleSubmit,
  onSubmit,
  sigCanvas,
  clearSignature,
  loading,
}: {
  register: UseFormRegister<WaiverFormValues>;
  errors: FieldErrors<WaiverFormValues>;
  handleSubmit: UseFormHandleSubmit<WaiverFormValues>;
  onSubmit: (data: WaiverFormValues) => void;
  sigCanvas: RefObject<SignatureCanvas | null>;
  clearSignature: () => void;
  loading: boolean;
}) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
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
            className="block text-sm font-medium text-pink-700 mb-2"
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
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="childName"
            className="block text-sm font-medium text-pink-700 mb-2"
          >
            Child&apos;s Name{" "}
            <span className="text-pink-400 text-xs">(if applicable)</span>
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
            className="block text-sm font-medium text-pink-700 mb-2"
          >
            Date <span className="text-red-500">*</span>
          </label>
          <input
            {...register("date")}
            type="date"
            id="date"
            readOnly
            aria-readonly="true"
            tabIndex={-1}
            className={`w-full px-4 py-3 rounded-lg border appearance-none min-w-0 bg-pink-50 cursor-not-allowed ${
              errors.date ? "border-red-500" : "border-pink-200"
            } outline-none text-pink-700`}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-pink-700 mb-2"
          >
            Location of Participation <span className="text-red-500">*</span>
          </label>
          <select
            {...register("location")}
            id="location"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.location ? "border-red-500" : "border-pink-200"
            } focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all bg-white text-pink-700`}
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
        <div className="block text-sm font-medium text-pink-700 mb-2">
          Signature <span className="text-red-500">*</span>
        </div>
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
              className="text-xs text-pink-600 hover:text-pink-700 font-medium px-2 py-1 rounded hover:bg-pink-100 transition-colors"
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
          <span className="text-sm text-pink-700 group-hover:text-pink-700 transition-colors">
            I confirm that I have read and agree to the above waiver and
            release of liability.
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
          <span className="text-sm text-pink-700 group-hover:text-pink-700 transition-colors">
            I am 18 years old or am signing on behalf of a minor participant.
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
  );
}
