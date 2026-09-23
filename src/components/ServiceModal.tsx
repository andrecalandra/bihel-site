import { useEffect } from "react";

export type ServiceModalData = {
  title: string;
  details: string;
  img: string;
};

export default function ServiceModal({
  service,
  onClose,
  onRequestQuote,
}: {
  service: ServiceModalData | null;
  onClose: () => void;
  onRequestQuote: (title: string) => void;
}) {
  useEffect(() => {
    if (!service) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div
        className="service-modal a-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="service-modal__close" aria-label="Fechar" onClick={onClose}>
          ✕
        </button>

        <div className="service-modal__media">
          <img src={service.img} alt={service.title} />
        </div>

        <div className="service-modal__body">
          <h3 id="service-modal-title">{service.title}</h3>
          <p>{service.details}</p>
        </div>

        <div className="service-modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>
            Fechar
          </button>
          <button
            className="btn btn--primary"
            onClick={() => onRequestQuote(service.title)}
          >
            Solicitar orçamento
          </button>
        </div>
      </div>
    </div>
  );
}
