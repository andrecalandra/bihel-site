import { useEffect, useRef } from "react";

/** Índice do card mais próximo da posição atual de scroll (o "card ativo"),
 *  usado em vez de contar por pixels pra não brigar com o scroll-snap. */
function currentIndex(el: HTMLElement): number {
  let closest = 0;
  let closestDist = Infinity;
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i] as HTMLElement;
    const dist = Math.abs(child.offsetLeft - el.scrollLeft);
    if (dist < closestDist) {
      closestDist = dist;
      closest = i;
    }
  }
  return closest;
}

/** Avança automaticamente um carrossel de scroll-snap (usado só no mobile,
 *  onde o CSS troca o grid por uma fileira horizontal). Pausa quando a
 *  pessoa toca/arrasta o carrossel e volta a andar sozinho depois de um
 *  tempo parado, pra não brigar com o gesto de arrastar do usuário. */
export function useAutoScrollCarousel<T extends HTMLElement>(
  itemCount: number,
  intervalMs = 3500
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || itemCount === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let paused = false;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;

    function pause() {
      paused = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
      }, 5000);
    }

    el.addEventListener("pointerdown", pause);
    el.addEventListener("touchstart", pause, { passive: true });

    const timer = setInterval(() => {
      if (paused) return;
      if (!window.matchMedia("(max-width: 760px)").matches) return;

      const nextIndex = (currentIndex(el) + 1) % itemCount;
      (el.children[nextIndex] as HTMLElement | undefined)?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }, intervalMs);

    return () => {
      clearInterval(timer);
      if (resumeTimer) clearTimeout(resumeTimer);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
    };
  }, [itemCount, intervalMs]);

  return ref;
}
