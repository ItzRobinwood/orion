import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { getContent } from "../services/contentService";

const sectors = [
  { key: "energia", icon: "⚡", labelFallback: "Energia" },
  { key: "transportes", icon: "🚆", labelFallback: "Transportes" },
  { key: "saude", icon: "🏥", labelFallback: "Saúde" },
  { key: "agua", icon: "💧", labelFallback: "Água potável e saneamento" },
  { key: "digital", icon: "🌐", labelFallback: "Infraestruturas digitais" },
  { key: "publica", icon: "🛡️", labelFallback: "Administração pública" },
];

const threats = [
  { key: "ransomware", fallback: "Ataques de ransomware" },
  { key: "vulnerabilidades", fallback: "Exploração de vulnerabilidades em infraestruturas críticas" },
  { key: "espionagem", fallback: "Espionagem digital" },
  { key: "cadeia", fallback: "Ataques a serviços públicos e cadeias de abastecimento" },
];

const sanctionBlocks = [
  {
    key: "essenciais",
    icon: "🛡️",
    color: "#dc2626",
    titleFallback: "ENTIDADES ESSENCIAIS",
    items: [
      { key: "multa", fallback: "Até €10 milhões ou 2% do volume de negócios" },
      { key: "auditorias", fallback: "Auditorias obrigatórias" },
      { key: "ordens", fallback: "Ordens de implementação de medidas" },
    ],
  },
  {
    key: "importantes",
    icon: "🗄️",
    color: "#ea580c",
    titleFallback: "ENTIDADES IMPORTANTES",
    items: [
      { key: "multa", fallback: "Até €7 milhões ou 1.4% do volume de negócios" },
      { key: "supervisao", fallback: "Supervisão regulatória" },
      { key: "responsabilizacao", fallback: "Responsabilização da gestão executiva" },
    ],
  },
];

const howWeHelp = [
  { key: "enquadramento", color: "#3c8dbc", bg: "#eaf4fb", icon: "🛡️", titleFallback: "ANÁLISE DE ENQUADRAMENTO", descFallback: "Determinamos se a sua entidade está abrangida pela NIS2" },
  { key: "maturidade", color: "#16a34a", bg: "#eaf7ee", icon: "📊", titleFallback: "AVALIAÇÃO DE MATURIDADE", descFallback: "Análise do nível atual de cibersegurança" },
  { key: "risco", color: "#9333ea", bg: "#f3e8ff", icon: "🎯", titleFallback: "GESTÃO DE RISCO", descFallback: "Implementação de framework de análise de risco" },
  { key: "politicas", color: "#ea580c", bg: "#fff3e8", icon: "📄", titleFallback: "POLÍTICAS E PROCEDIMENTOS", descFallback: "Desenvolvimento de documentação necessária" },
  { key: "controlos", color: "#dc2626", bg: "#fff0f0", icon: "🔒", titleFallback: "CONTROLOS TÉCNICOS", descFallback: "Implementação de medidas de segurança adequadas" },
  { key: "incidentes", color: "#7c3aed", bg: "#f0ebff", icon: "👁️", titleFallback: "GESTÃO DE INCIDENTES", descFallback: "Apoio à comunicação e resposta a incidentes" },
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
          <span className="page-badge">
            {getContent("NIS2", "Hero Badge", "LEGISLAÇÃO EUROPEIA")}
          </span>
          <h1 className="page-title">
            {getContent("NIS2", "Hero Título", "Diretiva NIS2 em Portugal")}
          </h1>
          <p className="page-subtitle">
            {getContent("NIS2", "Hero Subtítulo", "A Diretiva NIS2 foi transposta para a legislação portuguesa através do Decreto-Lei n.º 125/2025")}
          </p>
        </div>

        <div className="container py-5">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="nis2-dark-card">
                <h2>{getContent("NIS2", "O Que É Título", "O QUE É A DIRETIVA NIS2")}</h2>
                <p>
                  {getContent(
                    "NIS2",
                    "O Que É Texto",
                    "A Diretiva NIS2 (Network and Information Security Directive 2) é legislação europeia destinada a reforçar a cibersegurança e a resiliência digital das organizações que prestam serviços essenciais ou importantes para a sociedade e economia."
                  )}
                </p>
                {threats.map((t, i) => (
                  <div key={i} className="threat-item">
                    <span>⚠️</span>
                    {getContent("NIS2", `Ameaça ${t.key}`, t.fallback)}
                  </div>
                ))}
                <div className="footer-info">
                  <div className="label">
                    {getContent("NIS2", "Vigência Label", "Em vigor na União Europeia desde 2023")}
                  </div>
                  <div className="value">
                    {getContent(
                      "NIS2",
                      "Vigência Valor",
                      "Transposta para Portugal através do Decreto-Lei n.º 125/2025"
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="nis2-white-card">
                <h2>{getContent("NIS2", "Quem Se Aplica Título", "A QUEM SE APLICA")}</h2>
                <p style={{ fontSize: 13.5, color: "#64748b", marginBottom: 20 }}>
                  {getContent(
                    "NIS2",
                    "Quem Se Aplica Texto",
                    "A NIS2 aplica-se a Entidades Essenciais e Entidades Importantes:"
                  )}
                </p>
                {sectors.map((s, i) => (
                  <div key={i} className="sector-item">
                    <span>{s.icon}</span>
                    {getContent("NIS2", `Setor ${s.key}`, s.labelFallback)}
                  </div>
                ))}
                <div className="nis2-criteria-box">
                  {getContent(
                    "NIS2",
                    "Critérios Texto",
                    "Critérios gerais: Organizações com mais de 50 colaboradores ou com volume de negócios superior a 10 milhões de euros."
                  )}
                  <br />
                  {getContent(
                    "NIS2",
                    "Autoridade Texto",
                    "Em Portugal, a autoridade responsável é o Centro Nacional de Cibersegurança (CNCS)."
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container pb-5">
          <div className="sanctions-box">
            <div className="sanctions-icon">⚠️</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1.5, marginBottom: 8 }}>
              {getContent("NIS2", "Sanções Título", "SANÇÕES POR INCUMPRIMENTO")}
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 32 }}>
              {getContent("NIS2", "Sanções Subtítulo", "As penalizações por não conformidade são significativas")}
            </p>
            <div className="row g-4 mb-4">
              {sanctionBlocks.map((block, i) => (
                <div className="col-md-6" key={i}>
                  <div className="sanctions-card" style={{ borderLeft: `4px solid ${block.color}` }}>
                    <div className="sanctions-card-title">
                      {block.icon} {getContent("NIS2", `Sanções ${block.key} Título`, block.titleFallback)}
                    </div>
                    {block.items.map((item, j) => (
                      <div key={j} className="check-item">
                        <Check color={block.color} />
                        {getContent("NIS2", `Sanções ${block.key} ${item.key}`, item.fallback)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary-custom" onClick={() => navigate("/contacts")}>
              {getContent("NIS2", "CTA Sanções Botão", "AVALIE A SUA CONFORMIDADE NIS2 →")}
            </button>
          </div>
        </div>

        <div className="container pb-5">
          <div className="section-card">
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#3c8dbc", textAlign: "center", marginBottom: 36, letterSpacing: 1 }}>
              {getContent("NIS2", "Como Ajudamos Título", "COMO AJUDAMOS NA CONFORMIDADE NIS2")}
            </h2>
            <div className="row g-4">
              {howWeHelp.map((item, i) => (
                <div className="col-md-4" key={i}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div className="help-icon" style={{ background: item.bg, borderLeft: `3px solid ${item.color}` }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="help-title">
                        {getContent("NIS2", `Ajuda ${item.key} Título`, item.titleFallback)}
                      </div>
                      <div className="help-desc">
                        {getContent("NIS2", `Ajuda ${item.key} Descrição`, item.descFallback)}
                      </div>
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
