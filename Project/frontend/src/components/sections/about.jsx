import { getContent } from "../../services/contentService";

const cards = [
  { key: "missao", icon: "🎯", color: "#3c8dbc", bg: "#eaf4fb", border: "#3c8dbc", titleFallback: "MISSÃO: Proteger empresas e organizações contra ameaças cibernéticas através de soluções inovadoras, monitorização contínua e expertise especializada.", section: "Missão" },
  { key: "visao", icon: "👁️", color: "#16a34a", bg: "#eaf7ee", border: "#16a34a", titleFallback: "VISÃO: Ser a referência nacional em cibersegurança, reconhecidos pela excelência técnica, inovação e compromisso com a segurança dos nossos clientes.", section: "Visão" },
  { key: "valores", icon: "🏆", color: "#9333ea", bg: "#f3e8ff", border: "#9333ea", titleFallback: "VALORES: Integridade, excelência técnica, inovação contínua e compromisso total com a proteção dos dados e sistemas dos nossos clientes.", section: "Valores" },
];

function About() {
  return (
    <section className="py-5" style={{ background: "#f8fafc" }}>
      <div className="container">
        <div className="text-center mb-5">
          <span className="page-badge">
            {getContent("Início", "Sobre Badge", "QUEM SOMOS")}
          </span>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: "#1e293b", margin: "0 0 12px" }}>
            {getContent("Início", "Sobre Título", "Sobre a CyberBox Security")}
          </h2>
          <p style={{ color: "#64748b", fontSize: 15, maxWidth: 520, margin: "0 auto" }}>
            {getContent("Início", "Sobre Subtítulo", "Somos especialistas em cibersegurança com mais de 15 anos de experiência.")}
          </p>
        </div>

        <div className="row g-4">
          {cards.map((c, i) => (
            <div className="col-md-4" key={i}>
              <div style={{ background: "#fff", border: "1px solid #e5e4e7", borderTop: `3px solid ${c.border}`, borderRadius: 10, padding: 28, height: "100%" }}>
                <div style={{ width: 52, height: 52, background: c.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 20 }}>
                  {c.icon}
                </div>
                <h4 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: "#1e293b", marginBottom: 10 }}>
                  {getContent("Início", `Sobre ${c.section} Título`, c.titleFallback)}
                </h4>
                <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                  {getContent("Início", c.section, "")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
