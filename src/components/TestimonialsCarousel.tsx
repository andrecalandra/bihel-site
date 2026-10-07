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
  const [height, setHeight] = useState<number | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

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

  // A altura do carrossel acompanha o depoimento visível, em vez de usar a
  // do mais longo — senão os mais curtos ficam com um vão enorme embaixo.
  useEffect(() => {
    const el = slideRefs.current[index];
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [index]);

  return (
    <div
      className="testimonial-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        setPaused(true);
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current !== null) {
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
        }
        touchStartX.current = null;
        setPaused(false);
      }}
    >
      <div className="testimonial-carousel__viewport" style={height ? { height } : undefined}>
        <div
          className="testimonial-carousel__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((t, i) => {
            const color = AVATAR_COLORS[hash(t.author) % AVATAR_COLORS.length];
            return (
              <figure
                className="testimonial-carousel__slide"
                key={t.author}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                aria-hidden={i !== index}
              >
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

      <div className="testimonial-carousel__controls">
        <button
          type="button"
          className="testimonial-carousel__arrow"
          aria-label="Depoimento anterior"
          onClick={prev}
        >
          ‹
        </button>
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
        <button
          type="button"
          className="testimonial-carousel__arrow"
          aria-label="Próximo depoimento"
          onClick={next}
        >
          ›
        </button>
      </div>
    </div>
  );
}
