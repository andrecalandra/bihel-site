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
    let visible = false;

    function pause() {
      paused = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
      }, 5000);
    }

    el.addEventListener("pointerdown", pause);
    el.addEventListener("touchstart", pause, { passive: true });

    // Só avança enquanto a seção está mesmo visível — sem isso o autoplay
    // continua rodando com a pessoa em outra parte da página.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(el);

    const timer = setInterval(() => {
      if (paused || !visible) return;
      if (!window.matchMedia("(max-width: 760px)").matches) return;

      const nextIndex = (currentIndex(el) + 1) % itemCount;
      const nextCard = el.children[nextIndex] as HTMLElement | undefined;
      if (!nextCard) return;
      // scrollTo no próprio container (não scrollIntoView): rola só o
      // carrossel na horizontal, sem arrastar a página inteira na vertical.
      el.scrollTo({ left: nextCard.offsetLeft, behavior: "smooth" });
    }, intervalMs);

    return () => {
      clearInterval(timer);
      observer.disconnect();
      if (resumeTimer) clearTimeout(resumeTimer);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
    };
  }, [itemCount, intervalMs]);

  return ref;
}
