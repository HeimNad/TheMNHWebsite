import Link from "next/link";
import { CheckCircle2, CalendarHeart, Wallet, Pizza } from "lucide-react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import {
  ADDON_OPTIONS,
  AGREEMENT_ITEMS,
  DEPOSIT_AMOUNT,
  EARLIEST_START,
  FOOD_OPTIONS,
  LATEST_START,
  PACKAGE_OPTIONS,
  PIZZA_NOTE,
  PIZZA_OPTION,
  PIZZA_PREFERENCES,
  WAIVER_URL,
  type BookingFormValues,
} from "./bookingForm";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all";
const labelClass = "block text-sm font-medium text-pink-700 mb-2";

function Required() {
  return <span className="text-red-500"> *</span>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

export function StepIntro() {
  return (
    <div className="space-y-6 text-pink-800">
      <p className="leading-relaxed">
        Please complete this form and make sure all attending parents sign the
        waiver before the event:
      </p>
      <Link
        href="/waiver"
        className="inline-block font-semibold text-pink-600 underline break-all"
      >
        {WAIVER_URL}
      </Link>

      <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5 space-y-3">
        <p className="font-bold flex items-center gap-2 text-pink-700">
          <Wallet size={20} className="text-pink-500" />A ${DEPOSIT_AMOUNT}{" "}
          deposit is required to secure your booking.
        </p>
        <p className="text-sm">You can send the deposit via:</p>
        <ul className="text-sm space-y-1">
          <li>
            <strong>Zelle:</strong> 516-373-1319
          </li>
          <li>
            <strong>Venmo:</strong> @themnhwonderrides
          </li>
        </ul>
      </div>

      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2">
          <span className="text-pink-400 mt-1">•</span>
          <span>Your booking is only confirmed after the deposit is received.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-pink-400 mt-1">•</span>
          <span>
            The remaining balance is due before the party begins on the day of
            the event.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-pink-400 mt-1">•</span>
          <span>
            <strong>Please note:</strong> time slots are not held without a
            deposit.
          </span>
        </li>
      </ul>
    </div>
  );
}

export function StepContact({
  form,
}: {
  form: UseFormReturn<BookingFormValues>;
}) {
  const { register, formState } = form;
  const { errors } = formState;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-pink-700">Contact Information</h2>

      <div>
        <label htmlFor="parentName" className={labelClass}>
          Parent Name
          <Required />
        </label>
        <input
          id="parentName"
          type="text"
          autoComplete="name"
          className={inputClass}
          {...register("parentName")}
        />
        <FieldError message={errors.parentName?.message} />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone Number
          <Required />
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          className={inputClass}
          {...register("phone")}
        />
        <FieldError message={errors.phone?.message} />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
          <Required />
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>
    </div>
  );
}

export function StepDetails({
  form,
}: {
  form: UseFormReturn<BookingFormValues>;
}) {
  const { register, formState, control } = form;
  const { errors } = formState;
  const foodOptions = useWatch({ control, name: "foodOptions" });
  const wantsPizza = foodOptions?.includes(PIZZA_OPTION);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-pink-700">Party Details</h2>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="partyDate" className={labelClass}>
            Party Date
            <Required />
          </label>
          <input
            id="partyDate"
            type="date"
            className={inputClass}
            {...register("partyDate")}
          />
          <FieldError message={errors.partyDate?.message} />
        </div>
        <div>
          <label htmlFor="startTime" className={labelClass}>
            Party Start Time (11:00 AM – 6:00 PM)
            <Required />
          </label>
          <input
            id="startTime"
            type="time"
            min={EARLIEST_START}
            max={LATEST_START}
            className={inputClass}
            {...register("startTime")}
          />
          <FieldError message={errors.startTime?.message} />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>
          ⭐ Party Package
          <Required />
        </legend>
        <div className="space-y-3">
          {PACKAGE_OPTIONS.map((pkg) => (
            <label
              key={pkg.value}
              className="flex items-start gap-3 p-4 rounded-xl border border-pink-200 hover:bg-pink-50 cursor-pointer transition-colors has-checked:border-pink-500 has-checked:bg-pink-50"
            >
              <input
                type="radio"
                value={pkg.value}
                className="mt-1 accent-pink-500"
                {...register("packageType")}
              />
              <pkg.Icon size={20} className="mt-0.5 shrink-0 text-pink-500" />
              <span>
                <span className="block font-medium text-pink-800">
                  {pkg.value}
                </span>
                <span className="block text-sm text-pink-600">
                  {pkg.detail}
                </span>
              </span>
            </label>
          ))}
        </div>
        <FieldError message={errors.packageType?.message} />
      </fieldset>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="childCount" className={labelClass}>
            Estimated Number of Children
            <Required />
          </label>
          <input
            id="childCount"
            type="number"
            min={1}
            inputMode="numeric"
            className={inputClass}
            {...register("childCount")}
          />
          <FieldError message={errors.childCount?.message} />
        </div>
        <div>
          <label htmlFor="childAge" className={labelClass}>
            Age
            <Required />
          </label>
          <input
            id="childAge"
            type="text"
            placeholder="e.g. 5"
            className={inputClass}
            {...register("childAge")}
          />
          <FieldError message={errors.childAge?.message} />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Party Add-Ons (Optional)</legend>
        <div className="space-y-3">
          {ADDON_OPTIONS.map((addon) => (
            <label
              key={addon.value}
              className="flex items-center gap-3 p-4 rounded-xl border border-pink-200 hover:bg-pink-50 cursor-pointer transition-colors has-checked:border-pink-500 has-checked:bg-pink-50"
            >
              <input
                type="checkbox"
                value={addon.value}
                className="accent-pink-500"
                {...register("addOns")}
              />
              <span className="text-pink-800">{addon.value}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>
          Food Options (multiple choice)
          <Required />
        </legend>
        <div className="space-y-3">
          {FOOD_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 p-4 rounded-xl border border-pink-200 hover:bg-pink-50 cursor-pointer transition-colors has-checked:border-pink-500 has-checked:bg-pink-50"
            >
              <input
                type="checkbox"
                value={option}
                className="accent-pink-500"
                {...register("foodOptions")}
              />
              <span className="text-pink-800">{option}</span>
            </label>
          ))}
        </div>
        <FieldError message={errors.foodOptions?.message} />

        {wantsPizza && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-2xl p-5 space-y-5">
            <div>
              <p className="font-bold text-orange-900 flex items-center gap-2">
                <Pizza size={18} className="text-orange-500" />
                Pizza Options
              </p>
              <p className="text-sm text-orange-900 mt-1">{PIZZA_NOTE}</p>
            </div>

            <div>
              <span className={labelClass}>
                Pizza Preference
                <Required />
              </span>
              <div className="flex flex-wrap gap-3">
                {PIZZA_PREFERENCES.map((preference) => (
                  <label
                    key={preference}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-pink-200 bg-white hover:bg-pink-50 cursor-pointer transition-colors has-checked:border-pink-500 has-checked:bg-pink-50"
                  >
                    <input
                      type="radio"
                      value={preference}
                      className="accent-pink-500"
                      {...register("pizzaPreference")}
                    />
                    <span className="text-pink-800">{preference}</span>
                  </label>
                ))}
              </div>
              <FieldError message={errors.pizzaPreference?.message} />
            </div>

            <div className="sm:max-w-xs">
              <label htmlFor="pizzaCount" className={labelClass}>
                How Many Pizzas
                <Required />
              </label>
              <input
                id="pizzaCount"
                type="number"
                min={1}
                inputMode="numeric"
                className={inputClass}
                {...register("pizzaCount")}
              />
              <FieldError message={errors.pizzaCount?.message} />
            </div>
          </div>
        )}
      </fieldset>

      <div>
        <label htmlFor="specialRequests" className={labelClass}>
          Special Requests
        </label>
        <textarea
          id="specialRequests"
          rows={4}
          className={inputClass}
          {...register("specialRequests")}
        />
      </div>

      <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5">
        <p className="font-medium text-pink-800 mb-3">
          I understand and agree to the following:
          <Required />
        </p>
        <ul className="space-y-2 text-sm text-pink-700 mb-4">
          {AGREEMENT_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-pink-400 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 accent-pink-500"
            {...register("agreementAccepted")}
          />
          <span className="text-pink-800 text-sm font-medium">
            I understand and agree
          </span>
        </label>
        <FieldError message={errors.agreementAccepted?.message} />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
        <p className="font-medium text-yellow-900 mb-2">
          Waiver Form
          <Required />
        </p>
        <p className="text-sm text-yellow-900 mb-4">
          Please have all attending parents complete the waiver before the
          event.{" "}
          <Link href="/waiver" className="underline font-semibold break-all">
            {WAIVER_URL}
          </Link>
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 accent-pink-500"
            {...register("waiverAcknowledged")}
          />
          <span className="text-yellow-900 text-sm font-medium">
            I will make sure all attending parents sign the waiver
          </span>
        </label>
        <FieldError message={errors.waiverAcknowledged?.message} />
      </div>

      <fieldset>
        <legend className={labelClass}>
          Photo &amp; Video Permission
          <Required />
        </legend>
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 rounded-xl border border-pink-200 hover:bg-pink-50 cursor-pointer transition-colors has-checked:border-pink-500 has-checked:bg-pink-50">
            <input
              type="radio"
              value="yes"
              className="mt-1 accent-pink-500"
              {...register("photoPermission")}
            />
            <span className="text-pink-800 text-sm">
              Yes, I give The MNH Wonder Rides permission to use photos and
              videos from the event for marketing and promotional purposes.
            </span>
          </label>
          <label className="flex items-start gap-3 p-4 rounded-xl border border-pink-200 hover:bg-pink-50 cursor-pointer transition-colors has-checked:border-pink-500 has-checked:bg-pink-50">
            <input
              type="radio"
              value="no"
              className="mt-1 accent-pink-500"
              {...register("photoPermission")}
            />
            <span className="text-pink-800 text-sm">
              No, I do not give permission to use photos or videos from the
              event.
            </span>
          </label>
        </div>
        <FieldError message={errors.photoPermission?.message} />
      </fieldset>
    </div>
  );
}

export function BookingSuccess({ email }: { email: string }) {
  return (
    <div className="text-center py-10 space-y-4">
      <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 size={36} />
      </div>
      <h2 className="text-2xl font-bold text-pink-700">
        Booking Request Received!
      </h2>
      <p className="text-pink-700">
        We&apos;ve sent a confirmation to{" "}
        <strong className="break-all">{email}</strong>. Our team will reach out
        to finalize your party.
      </p>
      <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5 text-left text-sm text-pink-800 max-w-md mx-auto">
        <p className="font-bold flex items-center gap-2 mb-2">
          <CalendarHeart size={18} className="text-pink-500" />
          Next step: send your ${DEPOSIT_AMOUNT} deposit
        </p>
        <p>Zelle: 516-373-1319 · Venmo: @themnhwonderrides</p>
        <p className="mt-2">
          Your time slot is not held until the deposit is received.
        </p>
      </div>
      <Link
        href="/waiver"
        className="inline-block text-pink-600 hover:text-pink-700 font-medium underline"
      >
        Sign the waiver now →
      </Link>
    </div>
  );
}
