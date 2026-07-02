import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { getContent } from "../services/contentService";

const services = [
  {
    key: "nis2",
    icon: "🛡️", iconColor: "#3c8dbc", iconBg: "#eaf4fb",
    titleFallback: "IMPLEMENTAÇÃO DA DIRETIVA NIS2",
    descFallback: "Ajudamos a sua organização a alinhar-se com os requisitos da diretiva europeia NIS2 através de uma abordagem estruturada.",
    items: [
      { key: "enquadramento", fallback: "Análise de enquadramento da entidade" },
      { key: "maturidade", fallback: "Avaliação de maturidade de cibersegurança" },
      { key: "risco", fallback: "Análise e gestão de risco" },
      { key: "politicas", fallback: "Definição de políticas e procedimentos" },
      { key: "controlos", fallback: "Implementação de controlos técnicos" },
      { key: "incidentes", fallback: "Apoio à gestão de incidentes" },
    ],
    highlight: true,
  },
  {
    key: "auditorias",
    icon: "👁️", iconColor: "#9333ea", iconBg: "#f3e8ff",
    titleFallback: "AUDITORIAS DE CIBERSEGURANÇA",
    descFallback: "As auditorias permitem avaliar o nível real de segurança da organização.",
    items: [
      { key: "configuracao", fallback: "Auditorias de configuração de sistemas" },
      { key: "vulnerabilidades", fallback: "Análise de vulnerabilidades" },
      { key: "arquitetura", fallback: "Revisão da arquitetura de segurança" },
      { key: "acessos", fallback: "Avaliação de controlos de acesso" },
      { key: "politicasaudit", fallback: "Auditoria a políticas e procedimentos" },
    ],
    highlight: false,
  },
  {
    key: "formacao",
    icon: "👥", iconColor: "#ea580c", iconBg: "#fff3e8",
    titleFallback: "FORMAÇÃO E AWARENESS",
    descFallback: "Uma parte significativa dos incidentes de segurança começa com erro humano. Os programas de awareness ajudam a reduzir este risco.",
    items: [
      { key: "colaboradores", fallback: "Formação em cibersegurança para colaboradores" },
      { key: "phishing", fallback: "Campanhas de phishing simulado" },
      { key: "workshops", fallback: "Workshops para equipas técnicas" },
      { key: "gestao", fallback: "Sessões para equipas de gestão" },
    ],
    highlight: false,
  },
];

function Check({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function Services() {
  return (
    <>
      <Navbar />
      <main className="page-main">

        <div className="page-header">
          <span className="page-badge">
            {getContent("Serviços", "Hero Badge", "SOLUÇÕES EMPRESARIAIS")}
          </span>
          <h1 className="page-title">
            {getContent("Serviços", "Hero Título", "Os Nossos Serviços")}
          </h1>
          <p className="page-subtitle">
            {getContent(
              "Serviços",
              "Hero Subtítulo",
              "Oferecemos uma gama completa de serviços de cibersegurança adaptados às necessidades da sua organização."
            )}
          </p>
        </div>

        <div className="container py-5">
          <div className="row g-4">
            {services.map((s, i) => (
              <div className="col-lg-4" key={i}>
                <div className={`service-card ${s.highlight ? "destaque" : ""}`}>
                  {s.highlight && (
                    <div className="destaque-badge">
                      {getContent("Serviços", `Serviço ${s.key} Badge`, "DESTAQUE")}
                    </div>
                  )}
                  <div className="service-icon" style={{ background: s.iconBg }}>
                    {s.icon}
                  </div>
                  <h3 className="service-title">
                    {getContent("Serviços", `Serviço ${s.key} Título`, s.titleFallback)}
                  </h3>
                  <p className="service-desc">
                    {getContent("Serviços", `Serviço ${s.key} Descrição`, s.descFallback)}
                  </p>
                  <ul className="service-items">
                    {s.items.map((item, j) => (
                      <li key={j}>
                        <Check color={s.iconColor} />
                        {getContent("Serviços", `Serviço ${s.key} ${item.key}`, item.fallback)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container pb-5">
          <div className="critical-box">
            <h4>{getContent("Serviços", "Crítico Título", "PORQUE A CIBERSEGURANÇA É CRÍTICA")}</h4>
            <p>
              {getContent(
                "Serviços",
                "Crítico Texto",
                "Hoje em dia quase todas as organizações dependem de sistemas digitais para funcionar. Um incidente de segurança pode causar interrupção de serviços, perda de dados, impacto financeiro e danos reputacionais. A cibersegurança é hoje uma questão de continuidade do negócio."
              )}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Services;
