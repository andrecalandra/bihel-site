import { useCallback, useEffect, useRef, useState } from "react";

export type Testimonial = {
  quote: string;
  author: string;
  role: string | null;
};

const AVATAR_COLORS = ["#1c2a5c", "#27397c", "#0d1430", "#a97a2c", "#3d4f8f", "#5a3f8f"];

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AUTOPLAY_MS = 6500;

export default function TestimonialsCarousel({ items }: { items: readonly Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex(((i % items.length) + items.length) % items.length),
    [items.length]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % items.length), AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, items.length]);

  return (
    <div
      className="testimonial-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="testimonial-carousel__row">
        <button
          type="button"
          className="testimonial-carousel__arrow testimonial-carousel__arrow--prev"
          aria-label="Depoimento anterior"
          onClick={prev}
        >
          ‹
        </button>

        <div className="testimonial-carousel__viewport">
          <div
            className="testimonial-carousel__track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {items.map((t) => {
              const color = AVATAR_COLORS[hash(t.author) % AVATAR_COLORS.length];
              return (
                <figure className="testimonial-carousel__slide" key={t.author}>
                  <div className="testimonial-carousel__card">
                    <span className="testimonial-carousel__mark" aria-hidden="true">&ldquo;</span>
                    <blockquote>{t.quote}</blockquote>
                    <figcaption>
                      <span
                        className="testimonial-carousel__avatar"
                        style={{ background: color }}
                        aria-hidden="true"
                      >
                        {initialsOf(t.author)}
                      </span>
                      <span className="testimonial-carousel__who">
                        <span className="testimonial-carousel__author">{t.author}</span>
                        {t.role && <span className="testimonial-carousel__role">{t.role}</span>}
                      </span>
                    </figcaption>
                  </div>
                </figure>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="testimonial-carousel__arrow testimonial-carousel__arrow--next"
          aria-label="Próximo depoimento"
          onClick={next}
        >
          ›
        </button>
      </div>

      <div className="testimonial-carousel__dots">
        {items.map((t, i) => (
          <button
            key={t.author}
            type="button"
            className={`testimonial-carousel__dot ${i === index ? "is-active" : ""}`}
            aria-label={`Ir para depoimento de ${t.author}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
