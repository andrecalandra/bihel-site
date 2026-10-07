import { TEAM, TEAM_GROUP_IMG } from "../team";

export default function TeamSection() {
  const members = TEAM.filter((m) => m.name.trim() !== "");
  if (members.length === 0) return null;

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

        <figure className="team__banner reveal">
          <img
            src={TEAM_GROUP_IMG}
            alt="Equipe da Bihel Engenharia reunida"
            width={1600}
            height={1143}
            loading="lazy"
          />
        </figure>

        <div className="team__grid">
          {members.map((m, i) => (
            <article
              key={m.name}
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
