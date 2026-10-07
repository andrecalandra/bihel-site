import { HAS_TEAM, TEAM } from "../team";

export default function TeamSection() {
  if (!HAS_TEAM) return null;

  return (
    <section className="team" id="equipe">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-tag">Quem faz acontecer</span>
          <h2>Nossa equipe</h2>
          <p>
            Profissionais que acompanham de perto cada condomínio, com atendimento próximo e
            suporte técnico claro em todas as etapas.
          </p>
        </div>

        <div className="team__grid">
          {TEAM.map((m, i) => (
            <article
              key={m.img}
              className="team-card reveal"
              style={{ transitionDelay: `${Math.min(i, 4) * 70}ms` }}
            >
              <div className="team-card__img">
                <img src={m.img} alt={m.name} width={640} height={800} loading="lazy" />
              </div>
              <div className="team-card__body">
                <h3>{m.name}</h3>
                <span className="team-card__role">{m.role}</span>
                <p>{m.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
