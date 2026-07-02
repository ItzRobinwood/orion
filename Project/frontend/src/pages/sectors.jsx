import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { getContent } from "../services/contentService";

const sectors = [
  { key: "publica", color: "#2563eb", icon: "🛡️", titleFallback: "ADMINISTRAÇÃO PÚBLICA", descFallback: "Entidades governamentais e serviços públicos" },
  { key: "industria", color: "#9333ea", icon: "🗄️", titleFallback: "INDÚSTRIA", descFallback: "Manufatura e processos industriais" },
  { key: "energia", color: "#d97706", icon: "⚡", titleFallback: "ENERGIA", descFallback: "Produção e distribuição de energia" },
  { key: "saude", color: "#dc2626", icon: "🎯", titleFallback: "SAÚDE", descFallback: "Hospitais, clínicas e serviços de saúde" },
  { key: "transporte", color: "#16a34a", icon: "📈", titleFallback: "TRANSPORTE", descFallback: "Logística e infraestrutura de transporte" },
  { key: "tecnologia", color: "#4f46e5", icon: "🌐", titleFallback: "EMPRESAS TECNOLÓGICAS", descFallback: "Software, SaaS e serviços digitais" },
];

function Sectors() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <span className="page-badge">ÁREAS DE ATUAÇÃO</span>
          <h1 className="page-title">
            {getContent("Setores", "Hero Título", "Setores que Servimos")}
          </h1>
          <p className="page-subtitle">
            {getContent("Setores", "Hero Subtítulo", "Experiência especializada nas indústrias mais críticas e reguladas")}
          </p>
        </div>

        <div className="container py-5">
          <div className="row g-4">
            {sectors.map((s, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="sector-card" style={{ borderLeft: `4px solid ${s.color}` }}>
                  <div className="sector-card-icon">{s.icon}</div>
                  <div className="sector-card-title">
                    {getContent("Setores", `Setor ${s.key} Título`, s.titleFallback)}
                  </div>
                  <div className="sector-card-desc">
                    {getContent("Setores", `Setor ${s.key} Descrição`, s.descFallback)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container pb-5">
          <div className="cta-box">
            <h2 className="cta-title">
              {getContent("Setores", "CTA Título", "PRONTO PARA PROTEGER O SEU SETOR?")}
            </h2>
            <p className="cta-desc">
              {getContent("Setores", "CTA Texto", "Fale connosco e descubra como podemos ajudar a sua organização.")}
            </p>
            <button className="btn-primary-custom" onClick={() => navigate("/contact")}>FALAR COM UM ESPECIALISTA →</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Sectors;
