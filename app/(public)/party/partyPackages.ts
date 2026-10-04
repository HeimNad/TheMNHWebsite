import { PartyPopper, Palette, Sparkles } from "lucide-react";

export const packages = [
  {
    name: "Animal Rides Party",
    Icon: PartyPopper,
    description:
      "Exclusive animal ride time plus play area fun — the classic MNH birthday experience!",
    price: "$399",
    duration: "1.5 Hours",
    capacity: "Up to 10 Children",
    schedule: [
      ["0:00–0:15", "Guest Arrival & Check-In"],
      ["0:15–1:00", "Animal Rides & Play Area (Approx. 45 mins)"],
      ["1:00–1:25", "Food, Cake & Celebration"],
      ["1:25–1:30", "Photos & Free Play"],
    ],
    includes: [
      "Animal Ride Session",
      "Play Area Access",
      "Party Seating Area",
      "Staff Support",
    ],
    addon: "Additional Child: +$35",
    theme: {
      border: "border-pink-100",
      iconBg: "bg-pink-100 text-pink-600",
      title: "text-pink-700",
      priceBg: "bg-pink-400/60",
      chip: "text-pink-600 bg-pink-50",
      header: "bg-pink-500",
      addon: "bg-pink-500",
    },
  },
  {
    name: "DIY Craft Party",
    Icon: Palette,
    description:
      "Perler beads or painting — every child creates a one-of-a-kind piece to take home!",
    price: "$299",
    duration: "1.5 Hours",
    capacity: "Up to 10 Children",
    schedule: [
      ["0:00–0:15", "Guest Arrival & Check-In"],
      ["0:15–1:00", "DIY Activity: Perler Beads or Painting (Approx. 45 mins)"],
      ["1:00–1:25", "Food, Cake & Celebration"],
      ["1:25–1:30", "Photos & Take Home Creations"],
    ],
    includes: [
      "One DIY Activity Per Child (Perler Beads or Painting)",
      "All Craft Supplies Included",
      "Party Seating Area",
      "Staff Support",
      "Take Home Creation",
    ],
    addon: "Additional Child: +$30",
    theme: {
      border: "border-teal-100",
      iconBg: "bg-teal-100 text-teal-600",
      title: "text-teal-700",
      priceBg: "bg-teal-400/60",
      chip: "text-teal-600 bg-teal-50",
      header: "bg-teal-500",
      addon: "bg-teal-500",
    },
  },
  {
    name: "Animal Rides + DIY Party",
    Icon: Sparkles,
    description:
      "The ultimate combo! Animal rides, play, and a DIY craft activity all in one extended party.",
    price: "$649",
    duration: "2 Hours",
    capacity: "Up to 10 Children",
    schedule: [
      ["0:00–0:15", "Guest Arrival & Check-In"],
      ["0:15–0:50", "Animal Rides & Play Area (Approx. 35 mins)"],
      ["0:50–1:25", "DIY Activity: Perler Beads or Painting (Approx. 35 mins)"],
      ["1:25–1:55", "Food, Cake & Celebration"],
      ["1:55–2:00", "Group Photos & Pick Up Creations"],
    ],
    includes: [
      "Animal Ride Session",
      "One DIY Activity Per Child (Perler Beads or Painting)",
      "All Craft Supplies Included",
      "Play Area Access",
      "Party Seating Area",
      "Staff Support",
      "Take Home Creation",
    ],
    addon: "Additional Child: +$50",
    theme: {
      border: "border-purple-100",
      iconBg: "bg-purple-100 text-purple-600",
      title: "text-purple-700",
      priceBg: "bg-purple-400/60",
      chip: "text-purple-600 bg-purple-50",
      header: "bg-purple-500",
      addon: "bg-purple-500",
    },
  },
];

/** Included with every party package. */
export const partyEssentials = [
  "Birthday Hat for the Birthday Child",
  "Birthday Number Balloon & Welcome Balloons",
  "Party Table & Chair Setup",
  "Plates & Basic Party Tableware",
  "Water & Kids' Juice",
];

/** What families are welcome to bring themselves. */
export const bringYourOwn = [
  "Cake & outside food",
  "Additional decorations",
  "Music or a personal playlist",
];
