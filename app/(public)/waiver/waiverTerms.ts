export const WAIVER_RULES = [
  "Riders under 4 ft. must be accompanied on all rides by an adult",
  "Max weight limit: 250 lbs per animal ride",
  "No food or drinks while riding",
  "Riders may not go into stores or exit the mall during the ride",
  "No bumping into people or other riders",
  "All children must be supervised by an adult",
];

export const WAIVER_PARAGRAPHS = [
  `This Personal Injury Waiver (“Waiver”) is made by the undersigned for the purpose of participating in ride activities operated by The MNH Company LLC (the “Company”). The undersigned acknowledges and accepts that there are inherent risks of personal injury related to the use of the ride-on animals provided.`,
  `In consideration of being allowed to participate in these activities at the selected location (listed below), the undersigned voluntarily assumes all known and unknown risks and agrees to release, discharge, and hold harmless the Company, its owners, staff, affiliates, and partners from any and all claims, liabilities, damages, or losses arising from participation, including but not limited to any injuries, theft, accidents, or negligence.`,
  `This Waiver shall be binding upon the undersigned and their heirs, legal representatives, successors, and assigns. If any portion of this Waiver is deemed invalid, the remaining provisions shall remain fully enforceable.`,
];

// Snapshotted into waivers.waiver_text on every submission so the exact
// wording a signer agreed to is preserved even if this text changes later.
export const WAIVER_TERMS_TEXT = [
  "The MNH Wonder Rides Rules",
  ...WAIVER_RULES.map((rule) => `- ${rule}`),
  "",
  ...WAIVER_PARAGRAPHS,
].join("\n");
