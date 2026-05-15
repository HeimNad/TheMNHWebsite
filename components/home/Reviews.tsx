import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah M.",
    initials: "SM",
    color: "bg-purple-400",
    text: "My daughter was absolutely thrilled with the unicorn ride! She's been asking to go back every weekend. The staff is so patient and kind with the little ones.",
    time: "2 weeks ago",
  },
  {
    name: "James T.",
    initials: "JT",
    color: "bg-blue-400",
    text: "Brought my 3-year-old for the first time and he didn't want to leave! The dinosaur car is his new obsession. Clean, safe, and so much fun.",
    time: "1 month ago",
  },
  {
    name: "Michelle L.",
    initials: "ML",
    color: "bg-green-400",
    text: "We discovered this at Samanea Mall and it's become our go-to family activity. The rides are adorable and always well-maintained. My kids love it every time!",
    time: "3 weeks ago",
  },
  {
    name: "David K.",
    initials: "DK",
    color: "bg-orange-400",
    text: "Took my twins here for their birthday and they were in heaven! The variety of animal rides is amazing. Staff made the whole experience so special.",
    time: "1 month ago",
  },
  {
    name: "Emma R.",
    initials: "ER",
    color: "bg-pink-400",
    text: "Best hidden gem in Broadway Commons! My toddler is obsessed with the bunny ride. We come almost every week. Amazing value and always a magical time.",
    time: "2 weeks ago",
  },
  {
    name: "Kevin C.",
    initials: "KC",
    color: "bg-teal-400",
    text: "Such a wonderful experience for the whole family! My kids absolutely love the animal rides. One of those rare activities where kids AND parents both have a great time.",
    time: "5 weeks ago",
  },
];

export default function Reviews() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-pink-900 mb-3">
            What Families Are Saying
          </h2>
          <div className="flex items-center justify-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={22} className="fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-pink-600">Loved by hundreds of families across Long Island</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-pink-50 rounded-2xl p-6 border border-pink-100 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <Quote size={20} className="text-pink-300" />
              <p className="text-pink-900 text-sm leading-relaxed flex-1">
                {review.text}
              </p>
              <div className="flex gap-0.5 mt-auto">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="flex items-center gap-3 border-t border-pink-100 pt-4">
                <div
                  className={`${review.color} w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
                >
                  {review.initials}
                </div>
                <div>
                  <div className="font-semibold text-pink-900 text-sm">{review.name}</div>
                  <div className="text-pink-400 text-xs">{review.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
