"use client";

import { useWaiverForm } from "./useWaiverForm";
import { WaiverRulesNotice } from "./WaiverRulesNotice";
import { WaiverSuccessMessage } from "./WaiverSuccessMessage";
import { WaiverFormFields } from "./WaiverFormFields";

export default function WaiverPage() {
  const {
    sigCanvas,
    loading,
    status,
    setStatus,
    clearSignature,
    onSubmit,
    register,
    handleSubmit,
    formState: { errors },
  } = useWaiverForm();

  return (
    <div className="bg-pink-50 min-h-screen pt-16 pb-16">
      {/* Header Section */}
      <section className="bg-pink-100/50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-pink-700 mb-6">
            WAIVER AND RELEASE OF LIABILITY
          </h1>
          <p className="text-lg sm:text-xl text-pink-700 font-medium">
            The MNH Wonder Rides
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <WaiverRulesNotice />

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-8">
          {status.type === "success" ? (
            <WaiverSuccessMessage
              onReset={() => setStatus({ type: null, message: "" })}
            />
          ) : (
            <>
              {status.message && status.type === "error" && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
                  {status.message}
                </div>
              )}

              <WaiverFormFields
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                sigCanvas={sigCanvas}
                clearSignature={clearSignature}
                loading={loading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
