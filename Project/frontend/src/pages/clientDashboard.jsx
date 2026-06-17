import axios from 'axios';
import { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ClientDashboard() {
    const [active, setActive] = useState("dashboard");

    const nav = [
        { id: "dashboard",  label: "Dashboard"         },
        { id: "report",     label: "Avaliação de Risco" },
        { id: "docs",       label: "Documentação"       },
        { id: "submit",     label: "Submeter Ficheiros" },
        { id: "questions",  label: "Questões / Pedidos" },
        { id: "requests",   label: "Pedidos" },
    ];

    const renderContent = () => {
        switch (active) {
            case "dashboard":  return <Dashboard setActive={setActive} />;
            case "report":     return <Report />;
            case "docs":       return <Docs />;
            case "submit":     return <Submit />;
            case "questions":  return <Questions />;
            case "requests":   return <Requests />;
            default:           return null;
        }
    };

    return (
        <div className="d-flex vh-100">

            {/* SIDEBAR */}
            <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: 250 }}>
                <h4 className="mb-1">CyberBox</h4>
                <small className="text-secondary mb-4">Portal do Cliente</small>
                {nav.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`btn w-100 mb-2 text-start ${active === item.id ? "btn-primary" : "btn-outline-light"}`}
                    >
                        {item.label}
                    </button>
                ))}
                <div className="mt-auto pt-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <img src="https://i.pravatar.cc/32" className="rounded-circle" alt="cliente" />
                        <div>
                            <div className="small text-white fw-semibold">João Pereira</div>
                            <div className="small text-secondary">TechCorp</div>
                        </div>
                    </div>
                    <small className="text-secondary">© 2026 CyberBox</small>
                </div>
            </div>

            {/* MAIN */}
            <div className="flex-grow-1 bg-light p-4 overflow-auto">

                {/* TOPBAR */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="m-0">{nav.find(n => n.id === active)?.label}</h4>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary">Cliente</span>
                        <img src="https://i.pravatar.cc/40" className="rounded-circle" alt="cliente" />
                    </div>
                </div>

                {renderContent()}
            </div>
        </div>
    );
}

/* ───────────────────────── DASHBOARD ───────────────────────── */
function Dashboard({ setActive }) {
    return (
        <>
            <div className="row g-3 mb-4">
                <StatCard title="Nível de Risco"     value="Médio"  color="warning" />
                <StatCard title="Documentos"         value="12"     color="primary" />
                <StatCard title="Pedidos Ativos"     value="3"      color="info"    />
                <StatCard title="Incidentes Abertos" value="1"      color="danger"  />
            </div>

            <div className="row g-3">
                <div className="col-md-6">
                    <div className="card p-3">
                        <h6 className="mb-3">Atividade Recente</h6>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Relatório Q1 disponível</span>
                                <small className="text-muted">Hoje</small>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Pedido #P002 em análise</span>
                                <small className="text-muted">Ontem</small>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Incidente #I001 registado</span>
                                <small className="text-muted">12/05/2026</small>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3">
                        <h6 className="mb-3">Acesso Rápido</h6>
                        <div className="d-flex flex-column gap-2">
                            {[
                                { label: "Ver Avaliação de Risco", tab: "report"    },
                                { label: "Submeter Ficheiro",      tab: "submit"    },
                                { label: "Colocar Questão",        tab: "questions" },
                                { label: "Ver Estado de Pedidos",  tab: "requests"  },
                            ].map(({ label, tab }) => (
                                <button key={tab} className="btn btn-outline-dark btn-sm text-start"
                                    onClick={() => setActive(tab)}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ───────────────────────── REPORT ───────────────────────── */
function Report() {
    const reports = [
        { id: 1, title: "Relatório de Risco Q1 2026", date: "01/04/2026", risk: "Médio",  score: 62 },
        { id: 2, title: "Relatório de Risco Q4 2025", date: "01/01/2026", risk: "Alto",   score: 78 },
        { id: 3, title: "Relatório de Risco Q3 2025", date: "01/10/2025", risk: "Baixo",  score: 35 },
    ];

    const riskColor = { Alto: "danger", Médio: "warning", Baixo: "success" };

    return (
        <>
            {/* Score atual */}
            <div className="card p-4 mb-4">
                <div className="row align-items-center">
                    <div className="col-md-4 text-center">
                        <div style={{ fontSize: 64, fontWeight: 700, color: "#ffc107" }}>62</div>
                        <div className="text-muted" style={{ fontSize: 13 }}>Score de Risco Atual</div>
                        <span className="badge bg-warning text-dark mt-1">Risco Médio</span>
                    </div>
                    <div className="col-md-8">
                        <h6 className="mb-3">Áreas de Risco</h6>
                        {[
                            { label: "Segurança de Rede",        value: 70 },
                            { label: "Gestão de Acessos",        value: 55 },
                            { label: "Proteção de Dados",        value: 80 },
                            { label: "Continuidade de Negócio",  value: 45 },
                        ].map(({ label, value }) => (
                            <div className="mb-2" key={label}>
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13 }}>
                                    <span>{label}</span><span>{value}%</span>
                                </div>
                                <div className="progress" style={{ height: 6 }}>
                                    <div className="progress-bar"
                                        style={{ width: `${value}%`, background: value > 65 ? "#dc3545" : value > 45 ? "#ffc107" : "#198754" }}>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Histórico */}
            <div className="card p-3">
                <h6 className="mb-3">Histórico de Relatórios</h6>
                <table className="table">
                    <thead>
                        <tr><th>Relatório</th><th>Data</th><th>Risco</th><th>Score</th><th>Ação</th></tr>
                    </thead>
                    <tbody>
                        {reports.map(r => (
                            <tr key={r.id}>
                                <td style={{ fontWeight: 600 }}>{r.title}</td>
                                <td style={{ fontSize: 13, color: "#6b7280" }}>{r.date}</td>
                                <td><span className={`badge bg-${riskColor[r.risk]}`}>{r.risk}</span></td>
                                <td>{r.score}</td>
                                <td><button className="btn btn-sm btn-outline-dark">Download</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ───────────────────────── DOCS ───────────────────────── */
function Docs() {
    const docs = [
        { id: 1, name: "Política de Segurança v3",   type: "PDF",  date: "02/03/2026", size: "1.1 MB" },
        { id: 2, name: "Relatório NIS2 - Q1 2026",   type: "PDF",  date: "10/04/2026", size: "2.4 MB" },
        { id: 3, name: "Guia de Boas Práticas",      type: "DOCX", date: "15/02/2026", size: "0.8 MB" },
        { id: 4, name: "Plano de Resposta a Incidentes", type: "PDF", date: "01/01/2026", size: "3.2 MB" },
    ];

    return (
        <div className="card p-3">
            <h6 className="mb-3">Documentação Disponível</h6>
            <table className="table">
                <thead>
                    <tr><th>Nome</th><th>Tipo</th><th>Tamanho</th><th>Data</th><th>Ação</th></tr>
                </thead>
                <tbody>
                    {docs.map(d => (
                        <tr key={d.id}>
                            <td style={{ fontWeight: 600 }}>{d.name}</td>
                            <td><span className="badge bg-secondary">{d.type}</span></td>
                            <td style={{ fontSize: 13, color: "#6b7280" }}>{d.size}</td>
                            <td style={{ fontSize: 13, color: "#6b7280" }}>{d.date}</td>
                            <td><button className="btn btn-sm btn-outline-dark">Download</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ───────────────────────── SUBMIT ───────────────────────── */
function Submit() {
    const [subTab, setSubTab] = useState("assets");
    const [assets, setAssets] = useState([]);
    const [incident, setIncident] = useState({
        date: "", type: "", description: "", impact: "", systems: "", actions: "",
    });
    const [uploads, setUploads] = useState([]);
    const fileRef = useRef();

    /* ── Upload Excel e parse ── */
    const handleExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            /* Usa SheetJS se disponível, caso contrário parse manual CSV/TSV */
            try {
                /* tenta importar xlsx dinamicamente */
                import("https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs").then(XLSX => {
                    const wb = XLSX.read(evt.target.result, { type: "array" });
                    const ws = wb.Sheets[wb.SheetNames[0]];
                    const rows = XLSX.utils.sheet_to_json(ws);
                    setAssets(rows.map((r, i) => ({
                        id: i + 1,
                        name:     r["Nome"] || r["Name"] || r["Ativo"] || "-",
                        type:     r["Tipo"] || r["Type"] || "-",
                        ip:       r["IP"] || r["Endereço IP"] || "-",
                        location: r["Localização"] || r["Location"] || "-",
                        owner:    r["Responsável"] || r["Owner"] || "-",
                        risk:     r["Risco"] || r["Risk"] || "-",
                    })));
                });
            } catch {
                alert("Erro ao processar ficheiro. Certifica-te que é um ficheiro .xlsx válido.");
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleUpload = (e, category) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploads(prev => [...prev, {
            id: Date.now(), name: file.name,
            category, date: new Date().toLocaleDateString("pt-PT"),
        }]);
    };

    const subTabs = [
        { id: "assets",    label: "Ativos Tecnológicos" },
        { id: "incident",  label: "Report de Incidente" },
        { id: "internal",  label: "Documentação Interna" },
        { id: "pentest",   label: "Pen Tests" },
        { id: "evidence",  label: "Outras Evidências" },
    ];

    return (
        <div className="card p-3">
            <h6 className="mb-3">Submeter Ficheiros</h6>

            <ul className="nav nav-tabs mb-3">
                {subTabs.map(t => (
                    <li className="nav-item" key={t.id}>
                        <button className={`nav-link ${subTab === t.id ? "active" : ""}`}
                            onClick={() => setSubTab(t.id)}>
                            {t.label}
                        </button>
                    </li>
                ))}
            </ul>

            {/* ── Ativos Tecnológicos ── */}
            {subTab === "assets" && (
                <>
                    <div className="border rounded p-3 mb-3 bg-light">
                        <h6 className="mb-1">Upload de Ficheiro Excel</h6>
                        <p className="text-muted mb-2" style={{ fontSize: 13 }}>
                            Importa um ficheiro <strong>.xlsx</strong> com os ativos tecnológicos.
                            Colunas esperadas: <code>Nome, Tipo, IP, Localização, Responsável, Risco</code>
                        </p>
                        <div className="d-flex gap-2 align-items-center">
                            <input type="file" accept=".xlsx,.xls" className="form-control form-control-sm"
                                style={{ maxWidth: 300 }} onChange={handleExcel} />
                            <button className="btn btn-sm btn-outline-dark"
                                onClick={() => setAssets([
                                    { id: 1, name: "Servidor Web",   type: "Servidor",  ip: "192.168.1.10", location: "Datacenter A", owner: "IT Dept", risk: "Alto"  },
                                    { id: 2, name: "Firewall Principal", type: "Rede",  ip: "10.0.0.1",     location: "Rack 1",       owner: "IT Dept", risk: "Médio" },
                                    { id: 3, name: "Workstation-01", type: "Endpoint",  ip: "192.168.1.50", location: "Escritório",   owner: "João P.", risk: "Baixo" },
                                ])}>
                                Carregar Exemplo
                            </button>
                        </div>
                    </div>

                    {assets.length > 0 && (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ fontSize: 13, color: "#6b7280" }}>{assets.length} ativos importados</span>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => setAssets([])}>
                                    Limpar
                                </button>
                            </div>
                            <div style={{ overflowX: "auto" }}>
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>#</th><th>Nome</th><th>Tipo</th><th>IP</th>
                                            <th>Localização</th><th>Responsável</th><th>Risco</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assets.map(a => (
                                            <tr key={a.id}>
                                                <td style={{ color: "#6b7280" }}>{a.id}</td>
                                                <td style={{ fontWeight: 600 }}>{a.name}</td>
                                                <td><span className="badge bg-secondary">{a.type}</span></td>
                                                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.ip}</td>
                                                <td style={{ fontSize: 13 }}>{a.location}</td>
                                                <td style={{ fontSize: 13 }}>{a.owner}</td>
                                                <td>
                                                    <span className={`badge bg-${a.risk === "Alto" ? "danger" : a.risk === "Médio" ? "warning" : "success"}`}>
                                                        {a.risk}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button className="btn btn-sm btn-success mt-2">
                                Guardar na Base de Dados
                            </button>
                        </>
                    )}
                </>
            )}

            {/* ── Report de Incidente ── */}
           {subTab === "incident" && (
    <>
        <p className="text-muted mb-3" style={{ fontSize: 13 }}>
            Formulário baseado no modelo do{" "}
            <a href="https://www.cncs.gov.pt" target="_blank" rel="noreferrer">cncs.gov.pt</a>.
        </p>
        <div className="row g-3">
            <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Data do Incidente *</label>
                <input type="date" className="form-control form-control-sm"
                    value={incident.date} onChange={e => setIncident({ ...incident, date: e.target.value })} />
            </div>
            <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Tipo de Incidente *</label>
                <select className="form-select form-select-sm"
                    value={incident.type} onChange={e => setIncident({ ...incident, type: e.target.value })}>
                    <option value="">Selecionar...</option>
                    <option>Acesso não autorizado</option>
                    <option>Malware / Ransomware</option>
                    <option>Phishing</option>
                    <option>Negação de Serviço (DoS/DDoS)</option>
                    <option>Fuga de informação</option>
                    <option>Outro</option>
                </select>
            </div>
            <div className="col-md-12">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Descrição do Incidente *</label>
                <textarea className="form-control form-control-sm" rows={3}
                    placeholder="Descreva o incidente de forma detalhada..."
                    value={incident.description} onChange={e => setIncident({ ...incident, description: e.target.value })} />
            </div>
            <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Impacto</label>
                <select className="form-select form-select-sm"
                    value={incident.impact} onChange={e => setIncident({ ...incident, impact: e.target.value })}>
                    <option value="">Selecionar...</option>
                    <option>Baixo</option>
                    <option>Médio</option>
                    <option>Alto</option>
                    <option>Crítico</option>
                </select>
            </div>
            <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Sistemas Afetados</label>
                <input className="form-control form-control-sm"
                    placeholder="Ex: Servidor Web, Email..."
                    value={incident.systems} onChange={e => setIncident({ ...incident, systems: e.target.value })} />
            </div>
            <div className="col-md-12">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Ações Tomadas</label>
                <textarea className="form-control form-control-sm" rows={2}
                    placeholder="Que medidas foram tomadas imediatamente?"
                    value={incident.actions} onChange={e => setIncident({ ...incident, actions: e.target.value })} />
            </div>
            <div className="col-md-12">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Anexar Evidências</label>
                <input type="file" className="form-control form-control-sm"
                    onChange={e => handleUpload(e, "Incidente")} />
            </div>
        </div>
        
        
<button className="btn btn-sm btn-success mt-3" onClick={async () => {
    if (!incident.date || !incident.type || !incident.description) {
        alert("Por favor, preencha todos os campos obrigatórios (*).");
        return;
    }
    try {
        // 🟢 CORREÇÃO DEFINITIVA: Aponta para o seu servidor real (orion-dewp) com a rota certa
        const response = await axios.post('https://onrender.com', {
            ...incident,
            creatorId: 1 
        });
        
        if (response.data.success) {
            alert(response.data.message); 
            // Limpa o ecrã
            setIncident({ date: "", type: "", description: "", impact: "", systems: "", actions: "" });
        }
    } catch (error) {
        console.error("Erro na ligação à API:", error);
        alert(error.response?.data?.message || "Erro de ligação ao servidor.");
    }
}}>
    Submeter Incidente
</button>


    </>
)}


            {/* ── Outras tabs de upload ── */}
            {["internal", "pentest", "evidence"].includes(subTab) && (
                <>
                    <div className="border rounded p-3 mb-3 bg-light">
                        <h6 className="mb-2">
                            {subTab === "internal" ? "Documentação Interna" : subTab === "pentest" ? "Pen Tests" : "Outras Evidências"}
                        </h6>
                        <p className="text-muted mb-2" style={{ fontSize: 13 }}>
                            Seleciona o ficheiro que pretendes submeter.
                        </p>
                        <input type="file" className="form-control form-control-sm" style={{ maxWidth: 400 }}
                            onChange={e => handleUpload(e, subTab === "internal" ? "Documentação Interna" : subTab === "pentest" ? "Pen Test" : "Evidência")} />
                    </div>

                    {uploads.filter(u =>
                        (subTab === "internal" && u.category === "Documentação Interna") ||
                        (subTab === "pentest"  && u.category === "Pen Test") ||
                        (subTab === "evidence" && u.category === "Evidência")
                    ).length > 0 && (
                        <table className="table table-sm">
                            <thead>
                                <tr><th>Ficheiro</th><th>Categoria</th><th>Data</th></tr>
                            </thead>
                            <tbody>
                                {uploads.filter(u =>
                                    (subTab === "internal" && u.category === "Documentação Interna") ||
                                    (subTab === "pentest"  && u.category === "Pen Test") ||
                                    (subTab === "evidence" && u.category === "Evidência")
                                ).map(u => (
                                    <tr key={u.id}>
                                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                                        <td><span className="badge bg-secondary">{u.category}</span></td>
                                        <td style={{ fontSize: 13, color: "#6b7280" }}>{u.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
}

/* ───────────────────────── QUESTIONS ───────────────────────── */
function Questions() {
    const [questions, setQuestions] = useState([
        { id: 1, subject: "Dúvida sobre NIS2", message: "Quais são os requisitos mínimos?", date: "10/05/2026", status: "Respondido", reply: "Os requisitos mínimos incluem..." },
        { id: 2, subject: "Relatório em falta", message: "O relatório Q4 não está disponível.", date: "15/05/2026", status: "Pendente", reply: "" },
    ]);

    const [form, setForm] = useState({ subject: "", message: "" });
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = () => {
        if (!form.subject || !form.message) return;
        setQuestions([...questions, {
            id: Date.now(), ...form,
            date: new Date().toLocaleDateString("pt-PT"),
            status: "Pendente", reply: "",
        }]);
        setForm({ subject: "", message: "" });
        setShowForm(false);
    };

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Questões e Pedidos de Esclarecimento</h6>
                <button className="btn btn-sm btn-dark" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancelar" : "+ Nova Questão"}
                </button>
            </div>

            {showForm && (
                <div className="border p-3 mb-3 bg-light">
                    <div className="mb-2">
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Assunto *</label>
                        <input className="form-control form-control-sm" placeholder="Assunto da questão"
                            value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                    </div>
                    <div className="mb-2">
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Mensagem *</label>
                        <textarea className="form-control form-control-sm" rows={3}
                            placeholder="Descreva a sua questão ou pedido..."
                            value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                    </div>
                    <button className="btn btn-sm btn-success" onClick={handleSubmit}>Enviar</button>
                </div>
            )}

            <table className="table">
                <thead>
                    <tr><th>Assunto</th><th>Mensagem</th><th>Data</th><th>Estado</th><th>Resposta</th></tr>
                </thead>
                <tbody>
                    {questions.map(q => (
                        <tr key={q.id}>
                            <td style={{ fontWeight: 600 }}>{q.subject}</td>
                            <td style={{ fontSize: 13, color: "#6b7280", maxWidth: 200 }}>{q.message}</td>
                            <td style={{ fontSize: 13, color: "#6b7280" }}>{q.date}</td>
                            <td>
                                <span className={`badge ${q.status === "Respondido" ? "bg-success" : "bg-warning"}`}>
                                    {q.status}
                                </span>
                            </td>
                            <td style={{ fontSize: 13, color: "#6b7280", maxWidth: 200 }}>
                                {q.reply || <span className="text-muted fst-italic">Sem resposta ainda</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ───────────────────────── REQUESTS ───────────────────────── */


function Requests() {
    const [requests, setRequests] = useState([]);
    const [requestTypes, setRequestTypes] = useState([]);
    const [form, setForm] = useState({ type: "", notes: "" });
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const statusColor = { 
        Aprovado: "success", 
        "Em análise": "info", 
        Pendente: "warning", 
        Rejeitado: "danger" 
    };

    // Busca os tipos de pedido e os pedidos do cliente ao carregar usando Axios
    useEffect(() => {
        const fetchData = async () => {
            try {
             // Mantenha o endereço do Render + a rota específica de cada pedido
            const [typesRes, requestsRes] = await Promise.all([
                axios.get("https://onrender.com"),
                axios.get("https://onrender.com")
            ]);

                // No Axios, os dados vindos do servidor já estão em .data
                setRequestTypes(typesRes.data);
                setRequests(requestsRes.data);
            } catch (err) {
                console.error("Erro ao carregar dados com Axios:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Submete o novo pedido usando Axios
    const handleSubmit = async () => {
        if (!form.type) return;
        try {
            // Convertido para axios.post. O JSON.stringify deixa de ser necessário!
            const res = await axios.post("https://onrender.com", dados, 
                { 
                    type: form.type, 
                    notes: form.notes 
                },
                {
                    // Equivalente ao credentials: "include" do fetch (envia cookies/sessões)
                    withCredentials: true 
                }
            );

            // O novo objeto criado vem dentro de res.data
            const newRequest = res.data;
            
            setRequests([...requests, newRequest]);
            setForm({ type: "", notes: "" });
            setShowForm(false);
        } catch (err) {
            console.error("Erro ao submeter pedido com Axios:", err);
            alert("Não foi possível submeter o pedido.");
        }
    };

    if (loading) {
        return (
            <div className="card p-3">
                <p className="text-muted mb-0">A carregar...</p>
            </div>
        );
    }

    return (
        <div className="card p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold">Pedidos</h6>
                <button className="btn btn-sm btn-dark" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancelar" : "+ Novo Pedido"}
                </button>
            </div>

            {showForm && (
                <div className="border p-3 mb-3 bg-light rounded">
                    <div className="mb-2">
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Tipo de Pedido *</label>
                        <select className="form-select form-select-sm"
                            value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                            <option value="">Selecionar...</option>
                            {requestTypes.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Notas / Descrição</label>
                        <textarea className="form-control form-control-sm" rows={2}
                            placeholder="Informação adicional sobre o pedido..."
                            value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                    </div>
                    <button className="btn btn-sm btn-success" onClick={handleSubmit}>
                        Submeter Pedido
                    </button>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                    <thead>
                        <tr><th>ID</th><th>Tipo</th><th>Data</th><th>Estado</th><th>Notas</th></tr>
                    </thead>
                    <tbody>
                        {requests.map(r => (
                            <tr key={r.id}>
                                <td style={{ color: "#0d6efd", fontWeight: 600 }}>#{r.id}</td>
                                <td>{r.type_name || r.type}</td>
                                <td style={{ fontSize: 13, color: "#6b7280" }}>{r.date}</td>
                                <td>
                                    <span className={`badge bg-${statusColor[r.status] || 'secondary'}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td style={{ fontSize: 13, color: "#6b7280" }}>
                                    {r.notes || <span className="text-muted fst-italic">—</span>}
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center text-muted py-3">
                                    Nenhum pedido registado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


/* ───────────────────────── STAT CARD ───────────────────────── */
function StatCard({ title, value, color }) {
    return (
        <div className="col-md-3">
            <div className={`card text-bg-${color} p-3`}>
                <h6>{title}</h6>
                <h3>{value}</h3>
            </div>
        </div>
    );
}