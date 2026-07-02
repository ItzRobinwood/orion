import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { getContent } from "../services/contentService";

const methodology = [
  { key: "iso27001", titleFallback: "ISO/IEC 27001", descFallback: "Norma internacional para gestão de segurança da informação", color: "#3b82f6", bg: "#eaf2ff", icon: "🛡️" },
  { key: "nist", titleFallback: "NIST FRAMEWORK", descFallback: "Framework de cibersegurança do National Institute of Standards and Technology", color: "#16a34a", bg: "#eaf7ee", icon: "📊" },
  { key: "cis", titleFallback: "CIS CONTROLS", descFallback: "Conjunto prioritário de ações para defesa contra ameaças cibernéticas", color: "#9333ea", bg: "#f3e8ff", icon: "🎯" },
  { key: "enisa", titleFallback: "ENISA GUIDELINES", descFallback: "Recomendações da Agência Europeia para Segurança Cibernética", color: "#ea580c", bg: "#fff3e8", icon: "🏅" },
];

function Methodology() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <span className="page-badge">
            {getContent("Metodologia", "Hero Badge", "ABORDAGEM TÉCNICA")}
          </span>
          <h1 className="page-title">
            {getContent("Metodologia", "Hero Título", "A Nossa Metodologia")}
          </h1>
          <p className="page-subtitle">
            {getContent("Metodologia", "Hero Subtítulo", "Frameworks e normas internacionais que guiam o nosso trabalho")}
          </p>
        </div>

        <div className="container py-5">
          <div className="row g-4">
            {methodology.map((m, i) => (
              <div className="col-md-6" key={i}>
                <div className="sector-card" style={{ borderLeft: `4px solid ${m.color}` }}>
                  <div className="sector-card-icon" style={{ background: m.bg }}>{m.icon}</div>
                  <div className="sector-card-title">
                    {getContent("Metodologia", `Framework ${m.key} Título`, m.titleFallback)}
                  </div>
                  <div className="sector-card-desc">
                    {getContent("Metodologia", `Framework ${m.key} Descrição`, m.descFallback)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container pb-5">
          <div className="cta-box">
            <h2 className="cta-title">
              {getContent("Metodologia", "CTA Título", "QUER SABER MAIS SOBRE A NOSSA ABORDAGEM?")}
            </h2>
            <p className="cta-desc">
              {getContent("Metodologia", "CTA Texto", "Entre em contacto e explicamos como aplicamos estas frameworks ao seu caso.")}
            </p>
            <button className="btn-primary-custom" onClick={() => navigate("/contact")}>
              {getContent("Metodologia", "CTA Botão", "FALAR COM UM ESPECIALISTA →")}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Methodology;
