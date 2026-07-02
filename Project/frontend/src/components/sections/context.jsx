import { getContent } from "../../services/contentService";

const threats = [
  { key: "ransomware", icon: "⚠️", color: "#dc2626", bg: "#fff0f0", border: "#dc2626", titleFallback: "ATAQUES DE RANSOMWARE", descFallback: "Crescimento exponencial de ataques que encriptam dados e exigem resgates" },
  { key: "vulnerabilidades", icon: "🛡️", color: "#ea580c", bg: "#fff3e8", border: "#ea580c", titleFallback: "EXPLORAÇÃO DE VULNERABILIDADES", descFallback: "Aproveitamento de falhas de segurança em sistemas e aplicações" },
  { key: "infraestruturas", icon: "🖥️", color: "#7c3aed", bg: "#f0ebff", border: "#7c3aed", titleFallback: "ATAQUES A INFRAESTRUTURAS", descFallback: "Alvos estratégicos como energia, água e transportes sob ameaça constante" },
  { key: "phishing", icon: "✉️", color: "#3c8dbc", bg: "#eaf4fb", border: "#3c8dbc", titleFallback: "PHISHING DIRECIONADO", descFallback: "Ataques sofisticados que exploram o fator humano" },
];

function Context() {
  return (
    <section className="py-5" style={{ background: "#fff" }}>
      <div className="container">
        <div className="text-center mb-5">
          <span className="page-badge">
            {getContent("Início", "Contexto Badge", "PANORAMA ATUAL")}
          </span>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: "#1e293b", margin: "0 0 12px" }}>
            {getContent("Início", "Contexto Título", "O Contexto Atual")}
          </h2>
          <p style={{ color: "#64748b", fontSize: 15 }}>
            {getContent("Início", "Contexto Subtítulo", "A cibersegurança tornou-se uma prioridade estratégica para organizações públicas e privadas.")}
          </p>
        </div>

        <div className="row g-4 mb-4">
          {threats.map((t, i) => (
            <div className="col-md-3" key={i}>
              <div style={{ border: "1px solid #e5e4e7", borderTop: `3px solid ${t.border}`, borderRadius: 10, padding: 24, height: "100%" }}>
                <div style={{ width: 44, height: 44, background: t.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16 }}>
                  {t.icon}
                </div>
                <h4 style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8, color: "#1e293b", marginBottom: 8 }}>
                  {getContent("Início", `Ameaça ${t.key} Título`, t.titleFallback)}
                </h4>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                  {getContent("Início", `Ameaça ${t.key} Descrição`, t.descFallback)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#f8fafc", border: "1px solid #e5e4e7", borderLeft: "4px solid #3c8dbc", borderRadius: 10, padding: "24px 28px" }}>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.75, marginBottom: 12 }}>
            {getContent("Início", "Contexto Info", "Muitas organizações descobrem tarde demais que não estavam preparadas para um incidente de segurança.")}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#3c8dbc", fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>
            <span>✅</span> {getContent("Início", "Contexto Destaque", "A PREVENÇÃO É MAIS EFICAZ QUE A REMEDIAÇÃO")}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Context;
