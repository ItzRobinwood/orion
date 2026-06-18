import axios from 'axios';
import { useState, useRef, useEffect } from "react"; 
import "bootstrap/dist/css/bootstrap.min.css";

export default function ClientDashboard() {
    const [active, setActive] = useState("dashboard");

    const nav = [
        { id: "dashboard", label: "Dashboard"          },
        { id: "report",    label: "Avaliação de Risco" },
        { id: "docs",      label: "Documentação"       },
        { id: "tickets",   label: "Tickets"            },
        { id: "requests",  label: "Pedidos"            },
    ];

    const renderContent = () => {
        switch (active) {
            case "dashboard": return <Dashboard setActive={setActive} />;
            case "report":    return <Report />;
            case "docs":      return <Docs />;
            case "tickets":   return <Tickets />;
            case "requests":  return <Requests />;
            default:          return null;
        }
    };

    return (
        <div className="d-flex vh-100">
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

            <div className="flex-grow-1 bg-light p-4 overflow-auto">
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
                <StatCard title="Nível de Risco"     value="Médio" color="warning" />
                <StatCard title="Documentos"         value="12"    color="primary" />
                <StatCard title="Pedidos Ativos"     value="3"     color="info"    />
                <StatCard title="Incidentes Abertos" value="1"     color="danger"  />
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
                                { label: "Ver Avaliação de Risco", tab: "report"   },
                                { label: "Submeter Ficheiro",      tab: "docs"     },
                                { label: "Colocar Ticket",         tab: "tickets"  },
                                { label: "Ver Estado de Pedidos",  tab: "requests" },
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
        { id: 1, title: "Relatório de Risco Q1 2026", date: "01/04/2026", risk: "Médio", score: 62 },
        { id: 2, title: "Relatório de Risco Q4 2025", date: "01/01/2026", risk: "Alto",  score: 78 },
        { id: 3, title: "Relatório de Risco Q3 2025", date: "01/10/2025", risk: "Baixo", score: 35 },
    ];

    const riskColor = { Alto: "danger", Médio: "warning", Baixo: "success" };

    return (
        <>
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
                            { label: "Segurança de Rede",       value: 70 },
                            { label: "Gestão de Acessos",       value: 55 },
                            { label: "Proteção de Dados",       value: 80 },
                            { label: "Continuidade de Negócio", value: 45 },
                        ].map(({ label, value }) => (
                            <div className="mb-2" key={label}>
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13 }}>
                                    <span>{label}</span><span>{value}%</span>
                                </div>
                                <div className="progress" style={{ height: 6 }}>
                                    <div className="progress-bar"
                                        style={{ width: `${value}%`, background: value > 65 ? "#dc3545" : value > 45 ? "#ffc107" : "#198754" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

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
    const API = "https://orion-dewp.onrender.com/api";

    // Definição dos campos específicos que vão ser gerados e guardados dentro de 'description'
    const TYPE_FIELDS = {
        1: { // ReportIncident
            label: "Report de Incidente",
            fields: [
                { key: "incidentDate",  label: "Data do Incidente *",     type: "date" },
                { key: "incidentType",  label: "Tipo de Incidente *",     type: "select",
                  options: ["Acesso não autorizado", "Malware / Ransomware", "Phishing", "DoS/DDoS", "Fuga de informação", "Outro"] },
                { key: "details",       label: "Descrição detalhada *",    type: "textarea" },
                { key: "impact",        label: "Impacto estimado",        type: "select",
                  options: ["Baixo", "Médio", "Alto", "Crítico"] },
                { key: "systems",       label: "Sistemas Afetados",       type: "text",     placeholder: "Ex: Servidor Web, Email..." },
                { key: "actions",       label: "Ações Imediatas Tomadas", type: "textarea" },
            ]
        },
        2: { // Pentest
            label: "Pentest",
            fields: [
                { key: "scope",         label: "Âmbito do Teste *",       type: "select",
                  options: ["Rede interna", "Aplicação Web", "Engenharia social", "Físico", "Outro"] },
                { key: "targets",       label: "Sistemas Alvo (IPs/URLs) *", type: "text",  placeholder: "Ex: 192.168.1.0/24, app.empresa.pt" },
                { key: "objectives",    label: "Objetivos Principais *",  type: "textarea" },
                { key: "startDate",     label: "Data Pretendida para o Teste", type: "date" },
            ]
        },
        3: { // Documentation
            label: "Documentação",
            fields: [
                { key: "docType",       label: "Tipo de Documento Solicitado *", type: "select",
                  options: ["Política de Segurança", "Plano de Continuidade", "Procedimento", "Manual", "Outro"] },
                { key: "context",       label: "Contexto / Requisitos *", type: "textarea" },
            ]
        },
        4: { // Technological Assets
            label: "Ativos Tecnológicos",
            fields: [
                { key: "assetName",     label: "Nome do Ativo *",         type: "text",     placeholder: "Ex: Servidor Web Principal" },
                { key: "assetType",     label: "Tipo de Ativo *",         type: "select",
                  options: ["Servidor", "Workstation", "Rede", "Aplicação", "Cloud", "Outro"] },
                { key: "ip",            label: "Endereço IP / Subrede",   type: "text",     placeholder: "Ex: 192.168.1.10" },
                { key: "location",      label: "Localização Física/Cloud", type: "text",     placeholder: "Ex: Datacenter A, AWS" },
                { key: "notes",         label: "Notas Adicionais",        type: "textarea" },
            ]
        },
        5: { // Others
            label: "Outros",
            fields: [
                { key: "subtype",       label: "Especifique o Assunto *", type: "text",     placeholder: "Descreva brevemente o tipo de pedido" },
                { key: "details",       label: "Descrição do Pedido *",   type: "textarea" },
            ]
        },
        6: { // NIS2
            label: "NIS2",
            fields: [
                { key: "nis2Area",      label: "Área NIS2 Relacionada *", type: "select",
                  options: ["Gestão de Risco", "Resposta a Incidentes", "Segurança da Cadeia de Fornecimento", "Criptografia", "Continuidade de Negócio", "Outro"] },
                { key: "deadline",      label: "Prazo Limite de Conformidade", type: "date" },
                { key: "context",       label: "Descrição / Contexto Atual *", type: "textarea" },
                { key: "compliance",    label: "Estado Atual de Conformidade", type: "select",
                  options: ["Conforme", "Parcialmente conforme", "Não conforme", "Em avaliação"] },
            ]
        },
    };

    const REQUEST_TYPES = [
        { id: 1, name: "Report de Incidente" },
        { id: 2, name: "Pentest"             },
        { id: 3, name: "Documentação"        },
        { id: 4, name: "Ativos Tecnológicos" },
        { id: 5, name: "Outros"             },
        { id: 6, name: "NIS2"               },
    ];

    const [subTab, setSubTab]         = useState("form");
    const [typeId, setTypeId]         = useState("");
    const [formData, setFormData]     = useState({});
    const [file, setFile]             = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted]   = useState(false);

    const [dbFiles, setDbFiles]           = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);

    useEffect(() => {
        if (subTab === "docs") {
            fetchFiles();
        }
    }, [subTab]);

    const fetchFiles = async () => {
        setLoadingFiles(true);
        try {
            const token = localStorage.getItem("userToken");
            // Nota: Se a rota de ficheiros estiver mapeada sob outra rota, ajusta aqui 
            // Ex: `${API}/requests/files` ou apenas `${API}/files` dependendo do requestRoutes.js
            const res = await axios.get(`${API}/requests/files`, {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            });
            
            // Aceita o array diretamente ou embrulhado numa propriedade da resposta
            const data = res.data?.files || res.data;
            if (Array.isArray(data)) {
                setDbFiles(data);
            }
        } catch (err) {
            console.error("Erro ao carregar ficheiros:", err);
        } finally {
            setLoadingFiles(false);
        }
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            const token = localStorage.getItem("userToken");
            const response = await axios({
                url: `${API}/requests/files/download/${fileId}`,
                method: 'GET',
                responseType: 'blob',
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'documento');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Erro ao descarregar o ficheiro:", err);
            alert("Não foi possível realizar o download do ficheiro.");
        }
    };

    const currentConfig = typeId ? TYPE_FIELDS[typeId] : null;

    const handleField = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleTypeChange = (val) => {
        setTypeId(val);
        setFormData({});
        setSubmitted(false);
        setFile(null);
    };

    const handleSubmit = async () => {
        if (!typeId) { alert("Por favor, seleciona o tipo de pedido nos botões acima."); return; }

        const requiredFields = currentConfig.fields
            .filter(f => f.label.includes("*"))
            .map(f => f.key);
        
        const missing = requiredFields.find(k => !formData[k] || formData[k].trim() === "");
        if (missing) { alert("Preenche todos os campos obrigatórios (*)."); return; }

        setSubmitting(true);
        try {
            const formattedDescription = Object.entries(formData)
                .map(([key, val]) => {
                    const fieldLabel = currentConfig.fields.find(f => f.key === key)?.label.replace(" *", "") || key;
                    return `${fieldLabel}: ${val}`;
                })
                .join("\n");

            const token = localStorage.getItem("userToken");
            const activeUserId = localStorage.getItem("userId") || 1; // Padrão 1 caso venha vazio temporariamente
            const configHeaders = token ? { headers: { "Authorization": `Bearer ${token}` } } : {};

            let res;

            if (file) {
                const multiPartForm = new FormData();
                // Match perfeito com as colunas da tabela 'requests'
                multiPartForm.append("requestTypeId", Number(typeId));
                multiPartForm.append("subject", currentConfig.label);
                multiPartForm.append("description", formattedDescription); 
                multiPartForm.append("creatorId", Number(activeUserId));
                multiPartForm.append("file", file);

                res = await axios.post(`${API}/requests`, multiPartForm, {
                    headers: { 
                        "Content-Type": "multipart/form-data",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    }
                });
            } else {
                res = await axios.post(`${API}/requests`, {
                    requestTypeId: Number(typeId),
                    subject: currentConfig.label,
                    description: formattedDescription,
                    creatorId: Number(activeUserId),
                }, configHeaders);
            }

            if (res.status === 200 || res.status === 201 || res.data?.success) {
                setSubmitted(true);
                setFormData({});
                setTypeId("");
                setFile(null);
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Erro ao submeter pedido para o servidor.");
        } finally {
            setSubmitting(false);
        }
    };

    const renderField = (field) => {
        const val = formData[field.key] || "";
        const common = "form-control form-control-sm";

        if (field.type === "select") return (
            <select className="form-select form-select-sm" value={val}
                onChange={e => handleField(field.key, e.target.value)}>
                <option value="">Selecionar...</option>
                {field.options.map(o => <option key={o}>{o}</option>)}
            </select>
        );
        if (field.type === "textarea") return (
            <textarea className={common} rows={3}
                placeholder={field.placeholder || ""}
                value={val} onChange={e => handleField(field.key, e.target.value)} />
        );
        return (
            <input type={field.type} className={common}
                placeholder={field.placeholder || ""}
                value={val} onChange={e => handleField(field.key, e.target.value)} />
        );
    };

    return (
        <div className="card p-3">
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button className={`nav-link ${subTab === "form" ? "active" : ""}`} onClick={() => setSubTab("form")}>
                        Novo Pedido
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${subTab === "docs" ? "active" : ""}`} onClick={() => setSubTab("docs")}>
                        Documentação Disponível
                    </button>
                </li>
            </ul>

            {subTab === "form" && (
                <>
                    {submitted && (
                        <div className="alert alert-success d-flex align-items-center gap-2 mb-3">
                            <span>✅</span>
                            <span>Pedido registado com sucesso na base de dados!</span>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="form-label fw-semibold">O que pretendes solicitar? *</label>
                        <div className="d-flex flex-wrap gap-2">
                            {REQUEST_TYPES.map(t => (
                                <button key={t.id}
                                    type="button"
                                    onClick={() => handleTypeChange(String(t.id))}
                                    className={`btn btn-sm ${typeId === String(t.id) ? "btn-dark" : "btn-outline-secondary"}`}>
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {currentConfig && (
                        <>
                            <div className="border-top pt-3 mb-3">
                                <h6 className="text-muted mb-3" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
                                    Formulário: {currentConfig.label}
                                </h6>
                                <div className="row g-3">
                                    {currentConfig.fields.map(field => (
                                        <div key={field.key}
                                            className={field.type === "textarea" ? "col-12" : "col-md-6"}>
                                            <label className="form-label fw-semibold" style={{ fontSize: 12 }}>
                                                {field.label}
                                            </label>
                                            {renderField(field)}
                                        </div>
                                    ))}

                                    <div className="col-12">
                                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>
                                            Anexar Documento de Suporte (Envia para RequestFiles)
                                        </label>
                                        <input type="file" className="form-control form-control-sm"
                                            style={{ maxWidth: 400 }}
                                            onChange={e => setFile(e.target.files[0])} />
                                        {file && (
                                            <small className="text-success mt-1 d-block">
                                                📎 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-success"
                                    onClick={handleSubmit} disabled={submitting}>
                                    {submitting ? "A guardar no sistema..." : "Submeter Pedido"}
                                </button>
                                <button className="btn btn-sm btn-outline-secondary"
                                    onClick={() => { setTypeId(""); setFormData({}); setSubmitted(false); setFile(null); }}>
                                    Limpar
                                </button>
                            </div>
                        </>
                    )}

                    {!typeId && (
                        <p className="text-muted" style={{ fontSize: 13 }}>
                            Clica num dos botões acima para abrir o formulário correto.
                        </p>
                    )}
                </>
            )}

            {subTab === "docs" && (
                <div className="table-responsive">
                    {loadingFiles ? (
                        <p className="text-muted p-3">A carregar documentos do servidor...</p>
                    ) : dbFiles.length === 0 ? (
                        <p className="text-muted p-3">Nenhum documento disponível no repositório de RequestFiles.</p>
                    ) : (
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>ID Ficheiro</th>
                                    <th>Nome do Documento</th>
                                    <th>Ref. Pedido</th>
                                    <th>Data de Submissão</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dbFiles.map(f => (
                                    <tr key={f.id}>
                                        {/* 🟢 CORREÇÃO DOS CAMPOS: Usando camelCase estrito conforme a imagem da tabela */}
                                        <td>#{f.id}</td>
                                        <td style={{ fontWeight: 600 }}>{f.fileName || "Ficheiro Sem Nome"}</td>
                                        <td>
                                            <span className="badge bg-light text-dark">
                                                Pedido #{f.requestId || "N/A"}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 13, color: "#6b7280" }}>
                                            {f.uploadedAt ? new Date(f.uploadedAt).toLocaleDateString('pt-PT') : "---"}
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-sm btn-outline-dark"
                                                onClick={() => handleDownload(f.id, f.fileName)}
                                            >
                                                📥 Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}   
/* ───────────────────────── TICKETS ───────────────────────── */
function Tickets() {
    const [tickets, setTickets] = useState([
        { id: 1, subject: "Dúvida sobre NIS2", message: "Quais são os requisitos mínimos?", date: "10/05/2026", status: "Respondido", reply: "Os requisitos mínimos incluem..." },
        { id: 2, subject: "Relatório em falta", message: "O relatório Q4 não está disponível.", date: "15/05/2026", status: "Pendente", reply: "" },
    ]);
    const [form, setForm] = useState({ subject: "", message: "" });
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = () => {
        if (!form.subject || !form.message) return;
        setTickets([...tickets, {
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
                <h6 className="mb-0">Tickets</h6>
                <button className="btn btn-sm btn-dark" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancelar" : "+ Novo Ticket"}
                </button>
            </div>

            {showForm && (
                <div className="border p-3 mb-3 bg-light">
                    <div className="mb-2">
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Assunto *</label>
                        <input className="form-control form-control-sm" placeholder="Assunto do ticket"
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
                    {tickets.map(q => (
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
                axios.get("https://orion-dewp.onrender.com/api/request-types"), // ✅ rota correta
                axios.get("https://orion-dewp.onrender.com/api/requests")
            ]);

            setRequestTypes(typesRes.data);  // → [{ id: 1, name: "ReportIncident" }, ...]
            setRequests(requestsRes.data.requests);

                // No Axios, os dados vindos do servidor já estão em .data
                setRequestTypes(typesRes.data);
                setRequests(requestsRes.data.requests);
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
            const res = await axios.post("https://orion-dewp.onrender.com/api/requests", 
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
                    <button className="btn btn-sm btn-success" onClick={handleSubmit}>Submeter Pedido</button>
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