import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

const sectors = [
  { title: "ADMINISTRAÇÃO PÚBLICA", description: "Entidades governamentais e serviços públicos", color: "#2563eb", icon: "🛡️" },
  { title: "INDÚSTRIA", description: "Manufatura e processos industriais", color: "#9333ea", icon: "🗄️" },
  { title: "ENERGIA", description: "Produção e distribuição de energia", color: "#d97706", icon: "⚡" },
  { title: "SAÚDE", description: "Hospitais, clínicas e serviços de saúde", color: "#dc2626", icon: "🎯" },
  { title: "TRANSPORTE", description: "Logística e infraestrutura de transporte", color: "#16a34a", icon: "📈" },
  { title: "EMPRESAS TECNOLÓGICAS", description: "Software, SaaS e serviços digitais", color: "#4f46e5", icon: "🌐" },
];

function Sectors() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <span className="page-badge">ÁREAS DE ATUAÇÃO</span>
          <h1 className="page-title">Setores que Servimos</h1>
          <p className="page-subtitle">Experiência especializada nas indústrias mais críticas e reguladas</p>
        </div>

        <div className="container py-5">
          <div className="row g-4">
            {sectors.map((s, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="sector-card" style={{ borderLeft: `4px solid ${s.color}` }}>
                  <div className="sector-card-icon">{s.icon}</div>
                  <div className="sector-card-title">{s.title}</div>
                  <div className="sector-card-desc">{s.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container pb-5">
          <div className="cta-box">
            <h2 className="cta-title">PRONTO PARA PROTEGER O SEU SETOR?</h2>
            <p className="cta-desc">Fale connosco e descubra como podemos ajudar a sua organização.</p>
            <button className="btn-primary-custom" onClick={() => navigate("/contact")}>FALAR COM UM ESPECIALISTA →</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Sectors;