import { useState } from "react";
import { asset } from "../asset";

/** Endereço como aparece no site (mesmo texto do rodapé). */
export const ADDRESS_TEXT = "Rua Noronha Torrezão 24, sala 1714, Santa Rosa, Niterói - RJ";
// Para os mapas usamos só rua e número: o Google acha o ponto exato sem a sala.
const ADDRESS_QUERY = "Rua Noronha Torrezão 24, Santa Rosa, Niterói - RJ";

const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS_QUERY)}`;
const WAZE_URL = `https://waze.com/ul?q=${encodeURIComponent(ADDRESS_QUERY)}&navigate=yes`;
const EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_QUERY)}&z=17&output=embed`;

// Posição do ponto na imagem estática (em %), calculada a partir do tile do OpenStreetMap.
const PIN = { left: "58.57%", top: "63.31%" };

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
  </svg>
);

/**
 * "Onde estamos": mapa com visual da marca. O mapa interativo do Google só é carregado
 * quando a pessoa toca nele, assim a página abre rápida e nenhum dado vai ao Google antes disso.
 */
export default function LocationSection({ whatsappHref }: { whatsappHref: string }) {
  const [interactive, setInteractive] = useState(false);

  return (
    <section className="location" id="localizacao">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-tag">Onde estamos</span>
          <h2>Venha nos visitar</h2>
          <p>Nosso escritório fica em Santa Rosa, Niterói. Atendemos condomínios e edifícios de outras localidades também: fale conosco.</p>
        </div>

        <div className="location__box reveal">
          <div className="location__map">
            {interactive ? (
              <iframe
                title="Mapa com a localização da Bihel Engenharia"
                src={EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={asset("assets/mapa-bihel.webp")}
                  alt="Mapa da região de Santa Rosa, em Niterói, onde fica a Bihel Engenharia"
                  width={1536}
                  height={1024}
                  loading="lazy"
                />
                <span className="location__halo" style={PIN} aria-hidden="true" />
                <span className="location__pin" style={PIN} aria-hidden="true">
                  <PinIcon />
                </span>
                <button type="button" className="location__open" onClick={() => setInteractive(true)}>
                  Ver mapa interativo
                </button>
                <a
                  className="location__credit"
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  © Colaboradores do OpenStreetMap
                </a>
              </>
            )}
          </div>

          <div className="location__info">
            <span className="location__badge" aria-hidden="true">
              <PinIcon />
            </span>
            <h3>Bihel Engenharia</h3>
            <address>{ADDRESS_TEXT}</address>
            <p className="location__hint">Atendimento presencial e visitas técnicas. Para outras localidades, fale conosco.</p>
            <div className="location__actions">
              <a className="btn btn--primary" href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                Como chegar
              </a>
              <a className="btn btn--ghost" href={WAZE_URL} target="_blank" rel="noopener noreferrer">
                Abrir no Waze
              </a>
              <a
                className="btn btn--ghost"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-track="Seção Onde estamos"
              >
                Chamar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
