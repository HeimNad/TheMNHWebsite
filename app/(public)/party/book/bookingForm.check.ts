/**
 * Self-check for the booking form's non-obvious logic: durations parsed out of
 * the /party package copy, and the rules the API route trusts.
 * Run: node --experimental-strip-types "app/(public)/party/book/bookingForm.check.ts"
 */
import assert from "node:assert/strict";
import {
  PACKAGE_OPTIONS,
  PIZZA_OPTION,
  bookingFormSchema,
  partyMinutes,
} from "./bookingForm.ts";

// Durations come from strings like "1.5 Hours" / "2 Hours" on the party page.
assert.deepEqual(
  PACKAGE_OPTIONS.map((p) => p.minutes),
  [90, 90, 120]
);

const combo = "Animal Rides + DIY Party";
assert.equal(partyMinutes(combo, []), 120);
assert.equal(partyMinutes(combo, ["Extra 30 Minutes of Ride Time (+$100)"]), 150);
assert.throws(() => partyMinutes("Not A Package", []));

const valid = {
  parentName: "Jane Doe",
  phone: "5164236988",
  email: "jane@example.com",
  partyDate: "2030-05-01",
  startTime: "13:00",
  packageType: combo,
  childCount: "8",
  addOns: [],
  childAge: "5",
  foodOptions: ["I will bring my own food & cake"],
  agreementAccepted: true,
  waiverAcknowledged: true,
  photoPermission: "yes",
};
assert.equal(bookingFormSchema.safeParse(valid).success, true);

// The rules the server must not let through.
const rejects: Record<string, unknown> = {
  startTime: "09:00", // before 11:00
  childCount: "0",
  packageType: "Some Other Party",
  email: "not-an-email",
  agreementAccepted: false,
  foodOptions: [],
};
for (const [field, value] of Object.entries(rejects)) {
  assert.equal(
    bookingFormSchema.safeParse({ ...valid, [field]: value }).success,
    false,
    `expected invalid ${field} to be rejected`
  );
}

// Pizza details are required only when pizza help is asked for.
const withPizza = { ...valid, foodOptions: [PIZZA_OPTION] };
assert.equal(bookingFormSchema.safeParse(withPizza).success, false);
assert.equal(
  bookingFormSchema.safeParse({
    ...withPizza,
    pizzaPreference: "Cheese",
    pizzaCount: "3",
  }).success,
  true
);
assert.equal(
  bookingFormSchema.safeParse({ ...withPizza, pizzaPreference: "Anchovy", pizzaCount: "3" })
    .success,
  false
);
// ...and ignored (not required) when it isn't.
assert.equal(bookingFormSchema.safeParse({ ...valid, pizzaCount: "" }).success, true);

console.log("bookingForm checks passed");
