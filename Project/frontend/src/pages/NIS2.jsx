import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

const sectors = [
  { icon: "⚡", label: "Energia" },
  { icon: "🚆", label: "Transportes" },
  { icon: "🏥", label: "Saúde" },
  { icon: "💧", label: "Água potável e saneamento" },
  { icon: "🌐", label: "Infraestruturas digitais" },
  { icon: "🛡️", label: "Administração pública" },
];

const howWeHelp = [
  { color: "#3c8dbc", bg: "#eaf4fb", icon: "🛡️", title: "ANÁLISE DE ENQUADRAMENTO", desc: "Determinamos se a sua entidade está abrangida pela NIS2" },
  { color: "#16a34a", bg: "#eaf7ee", icon: "📊", title: "AVALIAÇÃO DE MATURIDADE", desc: "Análise do nível atual de cibersegurança" },
  { color: "#9333ea", bg: "#f3e8ff", icon: "🎯", title: "GESTÃO DE RISCO", desc: "Implementação de framework de análise de risco" },
  { color: "#ea580c", bg: "#fff3e8", icon: "📄", title: "POLÍTICAS E PROCEDIMENTOS", desc: "Desenvolvimento de documentação necessária" },
  { color: "#dc2626", bg: "#fff0f0", icon: "🔒", title: "CONTROLOS TÉCNICOS", desc: "Implementação de medidas de segurança adequadas" },
  { color: "#7c3aed", bg: "#f0ebff", icon: "👁️", title: "GESTÃO DE INCIDENTES", desc: "Apoio à comunicação e resposta a incidentes" },
];

function Check({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function NIS2() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <main className="page-main">

        <div className="page-header">
          <span className="page-badge">LEGISLAÇÃO EUROPEIA</span>
          <h1 className="page-title">Diretiva NIS2 em Portugal</h1>
          <p className="page-subtitle">A Diretiva NIS2 foi transposta para a legislação portuguesa através do Decreto-Lei n.º 125/2025</p>
        </div>

        <div className="container py-5">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="nis2-dark-card">
                <h2>O QUE É A DIRETIVA NIS2</h2>
                <p>A Diretiva NIS2 (Network and Information Security Directive 2) é legislação europeia destinada a reforçar a cibersegurança e a resiliência digital das organizações que prestam serviços essenciais ou importantes para a sociedade e economia.</p>
                {["Ataques de ransomware", "Exploração de vulnerabilidades em infraestruturas críticas", "Espionagem digital", "Ataques a serviços públicos e cadeias de abastecimento"].map((item, i) => (
                  <div key={i} className="threat-item"><span>⚠️</span>{item}</div>
                ))}
                <div className="footer-info">
                  <div className="label">Em vigor na União Europeia desde 2023</div>
                  <div className="value">Transposta para Portugal através do <strong style={{ color: "#fff" }}>Decreto-Lei n.º 125/2025</strong></div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="nis2-white-card">
                <h2>A QUEM SE APLICA</h2>
                <p style={{ fontSize: 13.5, color: "#64748b", marginBottom: 20 }}>A NIS2 aplica-se a <strong>Entidades Essenciais</strong> e <strong>Entidades Importantes</strong>:</p>
                {sectors.map((s, i) => (
                  <div key={i} className="sector-item"><span>{s.icon}</span>{s.label}</div>
                ))}
                <div className="nis2-criteria-box">
                  <strong>Critérios gerais:</strong> Organizações com <strong>mais de 50 colaboradores</strong> ou com <strong>volume de negócios superior a 10 milhões de euros</strong>.<br />
                  Em Portugal, a autoridade responsável é o <strong>Centro Nacional de Cibersegurança (CNCS)</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container pb-5">
          <div className="sanctions-box">
            <div className="sanctions-icon">⚠️</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1.5, marginBottom: 8 }}>SANÇÕES POR INCUMPRIMENTO</h2>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 32 }}>As penalizações por não conformidade são significativas</p>
            <div className="row g-4 mb-4">
              {[
                { title: "ENTIDADES ESSENCIAIS", icon: "🛡️", color: "#dc2626", items: ["Até €10 milhões ou 2% do volume de negócios", "Auditorias obrigatórias", "Ordens de implementação de medidas"] },
                { title: "ENTIDADES IMPORTANTES", icon: "🗄️", color: "#ea580c", items: ["Até €7 milhões ou 1.4% do volume de negócios", "Supervisão regulatória", "Responsabilização da gestão executiva"] },
              ].map((block, i) => (
                <div className="col-md-6" key={i}>
                  <div className="sanctions-card" style={{ borderLeft: `4px solid ${block.color}` }}>
                    <div className="sanctions-card-title">{block.icon} {block.title}</div>
                    {block.items.map((item, j) => (
                      <div key={j} className="check-item">
                        <Check color={block.color} />{item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary-custom" onClick={() => navigate("/contacts")}>
              AVALIE A SUA CONFORMIDADE NIS2 →
            </button>
          </div>
        </div>

        <div className="container pb-5">
          <div className="section-card">
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#3c8dbc", textAlign: "center", marginBottom: 36, letterSpacing: 1 }}>COMO AJUDAMOS NA CONFORMIDADE NIS2</h2>
            <div className="row g-4">
              {howWeHelp.map((item, i) => (
                <div className="col-md-4" key={i}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div className="help-icon" style={{ background: item.bg, borderLeft: `3px solid ${item.color}` }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="help-title">{item.title}</div>
                      <div className="help-desc">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default NIS2;