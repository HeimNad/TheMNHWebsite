import * as z from "zod";
import { packages } from "../partyPackages.ts";

export const DEPOSIT_AMOUNT = 100;
export const WAIVER_URL = "https://www.themnhwonderrides.com/waiver";

/**
 * Booking options are derived from the packages advertised on /party, so the
 * form can never drift from the prices and durations customers just read.
 */
export const PACKAGE_OPTIONS = packages.map((pkg) => ({
  value: pkg.name,
  Icon: pkg.Icon,
  detail: `${pkg.duration} | ${pkg.capacity}`,
  minutes: Math.round(parseFloat(pkg.duration) * 60),
}));

export const ADDON_OPTIONS = [
  { value: "Extra 15 Minutes of Ride Time (+$50)", minutes: 15 },
  { value: "Extra 30 Minutes of Ride Time (+$100)", minutes: 30 },
] as const;

export const PIZZA_OPTION = "I would like help ordering pizza";

export const FOOD_OPTIONS = [
  "I will bring my own food & cake",
  PIZZA_OPTION,
] as const;

export const PIZZA_PRICE = 50;
export const PIZZA_NOTE = `Pizza will be ordered from Pizza Hut or a similar provider. Large pizza: $${PIZZA_PRICE} each.`;
export const PIZZA_PREFERENCES = ["Cheese", "Pepperoni", "Mixed"] as const;

export const AGREEMENT_ITEMS = [
  "Deposit is non-refundable",
  "Final headcount must be confirmed before the event",
  "Additional children will be charged accordingly",
  "Remaining balance is due on the day of the event before the party begins",
] as const;

export const EARLIEST_START = "11:00";
export const LATEST_START = "18:00";

const packageValues = PACKAGE_OPTIONS.map((p) => p.value) as [
  string,
  ...string[],
];

const bookingFormFields = z.object({
  parentName: z.string().trim().min(1, "Parent name is required"),
  phone: z.string().trim().min(7, "A valid phone number is required"),
  email: z.email("Please enter a valid email address"),
  partyDate: z.string().min(1, "Party date is required"),
  startTime: z
    .string()
    .min(1, "Party start time is required")
    .refine(
      (t) => t >= EARLIEST_START && t <= LATEST_START,
      "Start time must be between 11:00 AM and 6:00 PM"
    ),
  packageType: z.enum(packageValues, {
    message: "Please choose a party package",
  }),
  childCount: z
    .string()
    .trim()
    .regex(/^[1-9]\d{0,2}$/, "Please enter the number of children"),
  addOns: z.array(z.string()),
  childAge: z.string().trim().min(1, "Age is required"),
  foodOptions: z.array(z.string()).min(1, "Please choose at least one option"),
  pizzaPreference: z.string().optional(),
  pizzaCount: z.string().optional(),
  specialRequests: z.string().trim().optional(),
  agreementAccepted: z.literal(true, {
    message: "Please confirm you understand and agree",
  }),
  waiverAcknowledged: z.literal(true, {
    message: "Please confirm all attending parents will sign the waiver",
  }),
  photoPermission: z.enum(["yes", "no"], {
    message: "Please select an option",
  }),
  website: z.string().optional(), // Honeypot field
});

export const bookingFormSchema = bookingFormFields.superRefine((data, ctx) => {
  // Pizza details are only asked for — and only required — when the guest
  // wants help ordering it.
  if (!data.foodOptions.includes(PIZZA_OPTION)) return;

  if (!PIZZA_PREFERENCES.includes(data.pizzaPreference as never)) {
    ctx.addIssue({
      code: "custom",
      path: ["pizzaPreference"],
      message: "Please choose a pizza preference",
    });
  }
  if (!/^[1-9]\d{0,2}$/.test(data.pizzaCount ?? "")) {
    ctx.addIssue({
      code: "custom",
      path: ["pizzaCount"],
      message: "Please enter how many pizzas",
    });
  }
});

export type BookingFormValues = z.infer<typeof bookingFormFields>;

/** Party length in minutes: package duration plus any extra ride time. */
export function partyMinutes(packageType: string, addOns: string[]) {
  const base = PACKAGE_OPTIONS.find((p) => p.value === packageType)?.minutes;
  if (!base) throw new Error(`Unknown package: ${packageType}`);
  const extra = ADDON_OPTIONS.filter((a) => addOns.includes(a.value)).reduce(
    (sum, a) => sum + a.minutes,
    0
  );
  return base + extra;
}
