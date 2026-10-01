import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import muavvidhPhoto from "@/assets/testimonials/muavvidh-buhary.jpeg.asset.json";
import sameeraPhoto from "@/assets/testimonials/sameera-s.jpeg.asset.json";

const AUTO_HOLD_SECONDS = 5;
const MANUAL_HOLD_SECONDS = 15;

type Testimonial = {
  name: string;
  role: string;
  organisation: string;
  quote: string;
  photo?: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Mohamed Habibullah M",
    role: "MBA · HR Intern",
    organisation: "MEASI Institute of Management",
    quote:
      "MentorWise AI’s workshops, aptitude tests and learning sessions gave me practical exposure beyond my MBA classroom. They strengthened my knowledge, confidence, problem-solving, recruitment readiness and understanding of the professional environment.",
  },
  {
    name: "Muavvidh Buhary S",
    role: "Final Year MBA",
    organisation: "MEASI Institute of Management",
    quote:
      "From the first orientation to becoming a Campus Leader, every challenge and workshop helped me build, communicate and grow. Even without a tech background, MentorWise AI encouraged me to contribute confidently to a free learning community.",
    photo: muavvidhPhoto.url,
  },
  {
    name: "Sameera S",
    role: "B.Tech Information Technology · Campus Ambassador",
    organisation: "Arunachala College of Engineering for Women",
    quote:
      "My experience with the team has been valuable. The activities and events helped me learn new things, improve my communication and networking skills, and connect with other students. I’m grateful for these useful opportunities.",
    photo: sameeraPhoto.url,
  },
  {
    name: "Shaik Malika Masarrath",
    role: "BE CSE",
    organisation: "Dhaanish Chennai College of Engineering",
    quote:
      "MentorWise AI helped me explore technology, build real projects and showcase skills beyond academics. Building Questoria AI and winning the Full Stack challenge strengthened my confidence to experiment, learn and grow in AI development.",
  },
];

export function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [remaining, setRemaining] = useState(AUTO_HOLD_SECONDS);
  const [holdDuration, setHoldDuration] = useState(AUTO_HOLD_SECONDS);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      setRemaining((current) => {
        if (current > 1) return current - 1;
        setDirection("next");
        setActive((index) => (index + 1) % testimonials.length);
        setHoldDuration(AUTO_HOLD_SECONDS);
        return AUTO_HOLD_SECONDS;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const navigate = (step: -1 | 1) => {
    setDirection(step === 1 ? "next" : "previous");
    setActive((index) => (index + step + testimonials.length) % testimonials.length);
    setHoldDuration(MANUAL_HOLD_SECONDS);
    setRemaining(MANUAL_HOLD_SECONDS);
  };

  const testimonial = testimonials[active];
  const initials = testimonial.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <section className="relative overflow-hidden border-y border-border/60 py-20 sm:py-24" aria-labelledby="student-voices-heading">
      <div aria-hidden className="absolute inset-0 mesh-grid opacity-20" />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-9 max-w-2xl text-center">
          <div className="pill"><Quote className="h-3.5 w-3.5 text-primary" /> Student voices</div>
          <h2 id="student-voices-heading" className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Learning that stays with you.
          </h2>
          <p className="mt-3 text-muted-foreground">Real experiences from the MentorWise AI community.</p>
        </div>

        <div
          className="mx-auto max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <article
            key={`${active}-${direction}`}
            className={`testimonial-card ${direction === "next" ? "testimonial-enter-right" : "testimonial-enter-left"} relative min-h-[420px] overflow-hidden rounded-[1.75rem] border border-border bg-card/95 p-6 shadow-2xl shadow-primary/10 sm:min-h-[350px] sm:p-10`}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-secondary">
              <div
                className="h-full bg-primary transition-[width] duration-1000 ease-linear"
                style={{ width: `${(remaining / holdDuration) * 100}%` }}
              />
            </div>

            <div className="grid min-h-[300px] gap-7 sm:grid-cols-[170px_1fr] sm:items-center">
              <div className="mx-auto">
                {testimonial.photo ? (
                  <img
                    src={testimonial.photo}
                    alt={`${testimonial.name}, MentorWise AI community member`}
                    className="h-32 w-32 rounded-full border-2 border-primary/60 object-cover object-top shadow-xl shadow-primary/10 sm:h-40 sm:w-40"
                  />
                ) : (
                  <div className="grid h-32 w-32 place-items-center rounded-full border border-primary/40 bg-primary/10 font-display text-4xl font-bold text-primary shadow-xl shadow-primary/10 sm:h-40 sm:w-40" aria-hidden="true">
                    {initials}
                  </div>
                )}
              </div>

              <div>
                <Quote className="mb-4 h-8 w-8 text-primary" aria-hidden="true" />
                <blockquote className="text-base leading-7 text-card-foreground sm:text-lg sm:leading-8">
                  “{testimonial.quote}”
                </blockquote>
                <div className="mt-6 border-l-2 border-primary pl-4">
                  <div className="font-display text-xl font-bold">{testimonial.name}</div>
                  <div className="mt-1 text-sm font-medium text-primary">{testimonial.role}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{testimonial.organisation}</div>
                </div>
              </div>
            </div>

            {paused && (
              <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur">
                <Pause className="h-3 w-3 fill-current" /> Paused
              </div>
            )}
          </article>

          <div className="mt-6 flex items-center justify-between gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)} aria-label="Previous feedback" title="Previous feedback">
              <ArrowLeft />
            </Button>

            <div className="flex items-center gap-2" aria-label={`Feedback ${active + 1} of ${testimonials.length}`}>
              {testimonials.map((item, index) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => {
                    setDirection(index > active ? "next" : "previous");
                    setActive(index);
                    setHoldDuration(MANUAL_HOLD_SECONDS);
                    setRemaining(MANUAL_HOLD_SECONDS);
                  }}
                  className={`h-8 min-w-8 p-0 hover:bg-transparent ${index === active ? "text-primary" : "text-muted-foreground"}`}
                  aria-label={`Read feedback from ${item.name}`}
                  aria-current={index === active ? "true" : undefined}
                >
                  <span className={`block h-2 rounded-full bg-current transition-all ${index === active ? "w-8" : "w-2"}`} />
                </Button>
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={() => navigate(1)} aria-label="Next feedback" title="Next feedback">
              <ArrowRight />
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
            {paused ? "Held while you read" : `${remaining}s until the next story`}
          </p>
        </div>
      </div>
    </section>
  );
}