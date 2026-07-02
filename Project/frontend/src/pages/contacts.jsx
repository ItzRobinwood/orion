import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState } from "react";
import { getContent } from "../services/contentService";

const contactInfo = [
  { key: "email", icon: "📧", titleFallback: "EMAIL", valueFallback: "geral@orion.pt", link: "mailto:geral@orion.pt", color: "#3c8dbc", bg: "#eaf4fb" },
  { key: "telefone", icon: "📞", titleFallback: "TELEFONE", valueFallback: "+351 000 000 000", link: "tel:+351000000000", color: "#16a34a", bg: "#eaf7ee" },
  { key: "localizacao", icon: "📍", titleFallback: "LOCALIZAÇÃO", valueFallback: "Lisboa, Portugal", link: null, color: "#9333ea", bg: "#f3e8ff" },
  { key: "horario", icon: "🕐", titleFallback: "HORÁRIO", valueFallback: "Seg–Sex, 9h–18h", link: null, color: "#ea580c", bg: "#fff3e8" },
];

function Contacts() {
  const [form, setForm] = useState({ nome: "", email: "", empresa: "", assunto: "", mensagem: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.nome || !form.email || !form.mensagem) return alert(getContent("Contactos", "Alerta Obrigatórios", "Preenche os campos obrigatórios."));
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="page-header">
          <span className="page-badge">
            {getContent("Contactos", "Hero Badge", "CONTACTO")}
          </span>
          <h1 className="page-title">
            {getContent("Contactos", "Hero Título", "Fale Connosco")}
          </h1>
          <p className="page-subtitle">
            {getContent("Contactos", "Hero Subtítulo", "A nossa equipa está pronta para ajudar a proteger a sua organização")}
          </p>
        </div>

        <div className="container py-5" style={{ maxWidth: 1100 }}>
          <div className="row g-4 mb-4">
            {contactInfo.map((c, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className="contact-card" style={{ borderLeft: `4px solid ${c.color}` }}>
                  <div className="contact-card-icon" style={{ background: c.bg }}>{c.icon}</div>
                  <div className="contact-card-label">
                    {getContent("Contactos", `Info ${c.key} Título`, c.titleFallback)}
                  </div>
                  {c.link
                    ? (
                      <a href={c.link} className="contact-card-link" style={{ color: c.color }}>
                        {getContent("Contactos", `Info ${c.key} Valor`, c.valueFallback)}
                      </a>
                    )
                    : (
                      <div className="contact-card-value">
                        {getContent("Contactos", `Info ${c.key} Valor`, c.valueFallback)}
                      </div>
                    )
                  }
                </div>
              </div>
            ))}
          </div>

          <div className="row justify-content-center g-4">
            <div className="col-lg-8">
              <div className="form-box">
                <h2 className="form-box-title">
                  {getContent("Contactos", "Formulário Título", "ENVIAR MENSAGEM")}
                </h2>
                {sent ? (
                  <div className="success-box">
                    <div className="success-icon">✅</div>
                    <div className="success-title">
                      {getContent("Contactos", "Sucesso Título", "Mensagem enviada!")}
                    </div>
                    <div className="success-desc">
                      {getContent("Contactos", "Sucesso Texto", "Entraremos em contacto brevemente.")}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label-custom">
                          {getContent("Contactos", "Campo Nome Label", "Nome *")}
                        </label>
                        <input
                          name="nome"
                          value={form.nome}
                          onChange={handle}
                          placeholder={getContent("Contactos", "Campo Nome Placeholder", "O seu nome")}
                          className="form-input"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label-custom">
                          {getContent("Contactos", "Campo Email Label", "Email *")}
                        </label>
                        <input
                          name="email"
                          value={form.email}
                          onChange={handle}
                          placeholder={getContent("Contactos", "Campo Email Placeholder", "email@empresa.pt")}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label-custom">
                          {getContent("Contactos", "Campo Empresa Label", "Empresa")}
                        </label>
                        <input
                          name="empresa"
                          value={form.empresa}
                          onChange={handle}
                          placeholder={getContent("Contactos", "Campo Empresa Placeholder", "Nome da empresa")}
                          className="form-input"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label-custom">
                          {getContent("Contactos", "Campo Assunto Label", "Assunto")}
                        </label>
                        <input
                          name="assunto"
                          value={form.assunto}
                          onChange={handle}
                          placeholder={getContent("Contactos", "Campo Assunto Placeholder", "Ex: Avaliação NIS2")}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label-custom">
                        {getContent("Contactos", "Campo Mensagem Label", "Mensagem *")}
                      </label>
                      <textarea
                        name="mensagem"
                        value={form.mensagem}
                        onChange={handle}
                        placeholder={getContent("Contactos", "Campo Mensagem Placeholder", "Descreva como podemos ajudar...")}
                        rows={5}
                        className="form-input"
                        style={{ resize: "vertical" }}
                      />
                    </div>
                    <button onClick={submit} disabled={loading} className="btn-primary-custom" style={{ opacity: loading ? 0.7 : 1 }}>
                      {loading
                        ? getContent("Contactos", "Botão A Enviar", "A enviar...")
                        : getContent("Contactos", "Botão Enviar", "ENVIAR MENSAGEM →")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Contacts;
