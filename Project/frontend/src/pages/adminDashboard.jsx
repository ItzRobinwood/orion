import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';


export default function AdminDashboard() {
    const [active, setActive] = useState("dashboard");

    const nav = [
        { id: "dashboard", label: "Dashboard" },
        { id: "accounts", label: "Contas" },
        { id: "tickets", label: "Tickets" },
        { id: "requests", label: "Pedidos" },
        { id: "docs", label: "Documentos" },
        { id: "settings", label: "Configurações" },
        { id: "content", label: "Gestão de Conteúdo" },
    ];

    const renderContent = () => {
        switch (active) {
            case "dashboard": return <Dashboard />;
            case "accounts": return <Accounts />;
            case "tickets": return <Tickets />;
            case "requests": return <Requests />;
            case "docs": return <Docs />;
            case "settings": return <Settings />;
            case "content": return <Content />;
            default: return null;
        }
    };

    return (
        <div className="d-flex vh-100">
            <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: 250 }}>
                <h4 className="mb-4">CyberBox</h4>
                {nav.map((item) => (
                    <button key={item.id} onClick={() => setActive(item.id)}
                        className={`btn w-100 mb-2 text-start ${active === item.id ? "btn-primary" : "btn-outline-light"}`}>
                        {item.label}
                    </button>
                ))}
                <div className="mt-auto pt-4 small text-secondary">© 2026 CyberBox</div>
            </div>
            <div className="flex-grow-1 bg-light p-4 overflow-auto">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="m-0 text-capitalize">{active}</h4>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-dark">Admin</span>
                        <img src="https://i.pravatar.cc/40" className="rounded-circle" alt="admin" />
                    </div>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}

function Card({ title, value, color }) {
    return (
        <div className="col-md-3">
            <div className={`card text-bg-${color} p-3`}>
                <h6>{title}</h6>
                <h3>{value}</h3>
            </div>
        </div>
    );
}

function Dashboard() {
    const [stats, setStats] = useState({ users: 0, tickets: 0, requests: 0 });
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [statsRes, logsRes] = await Promise.all([
                    axios.get("https://orion-dewp.onrender.com/api/stats"),
                    axios.get("https://orion-dewp.onrender.com/api/logs")
                ]);

                if (statsRes.data.success) setStats(statsRes.data.stats);
                if (logsRes.data.success) setLogs(logsRes.data.logs);
            } catch (err) {
                console.error("Erro ao carregar dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const actionColor = (action) => {
        switch (action) {
            case "LOGIN": return "text-primary";
            case "CREATE": return "text-success";
            case "ASSIGN": return "text-warning";
            case "REPLY": return "text-info";
            case "CLOSE": return "text-secondary";
            default: return "text-dark";
        }
    };

    const actionIcon = (action) => {
        switch (action) {
            case "LOGIN": return "🔐";
            case "CREATE": return "➕";
            case "ASSIGN": return "👤";
            case "REPLY": return "💬";
            case "CLOSE": return "✅";
            default: return "📋";
        }
    };

    if (loading) return <div className="text-center my-5"><h5>A carregar dashboard...</h5></div>;

    return (
        <>
            {/* Cards de estatísticas */}
            <div className="row g-3 mb-4">
                <Card title="Utilizadores" value={stats.users} color="primary" />
                <Card title="Tickets" value={stats.tickets} color="danger" />
                <Card title="Pedidos" value={stats.requests} color="warning" />
            </div>

            {/* Atividade recente */}
            <div className="card p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold m-0">Atividade Recente</h6>
                    <span className="badge bg-secondary">{logs.length} registos</span>
                </div>
                <ul className="list-group list-group-flush">
                    {logs.length === 0 && (
                        <li className="list-group-item text-muted text-center">
                            Nenhuma atividade registada.
                        </li>
                    )}
                    {logs.map(log => (
                        <li key={log.id} className="list-group-item d-flex justify-content-between align-items-start py-2">
                            <div>
                                <span className="me-2">{actionIcon(log.action)}</span>
                                <span className={`fw-semibold me-1 ${actionColor(log.action)}`}>
                                    [{log.action}]
                                </span>
                                <span className="text-dark">{log.details}</span>
                                <div className="text-muted" style={{ fontSize: 11 }}>
                                    👤 {log.user} · 🌐 {log.ip}
                                </div>
                            </div>
                            <div className="text-end text-muted" style={{ fontSize: 11, minWidth: 80 }}>
                                <div>{log.date}</div>
                                <div>{log.time}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [managers, setManagers] = useState([]);
    const [clients, setClients] = useState([]);

    const reloadAdmins = async () => {
        try {
            const res = await axios.get("https://orion-dewp.onrender.com/api/users");
            const data = res.data;
            const mapped = data.users
                .filter(u => u.id_tipo === 1)
                .map(u => ({
                    ...u,
                    id: u.id_Utilizador,
                    phone: u.telephone,
                    status: u.active ? "Ativo" : "Inativo"
                }));
            setAdmins(mapped);
        } catch (err) {
            console.error("Error loading admins:", err);
        }
    };

    const reloadManagers = async () => {
        try {
            const res = await axios.get("https://orion-dewp.onrender.com/api/users");
            const data = res.data;
            const mapped = data.users
                .filter(u => u.id_tipo === 2)
                .map(u => ({
                    ...u,
                    id: u.id_Utilizador,
                    phone: u.telephone,
                    status: u.active ? "Ativo" : "Inativo"
                }));
            setManagers(mapped);
        } catch (err) {
            console.error("Error loading managers:", err);
        }
    };

    // 🔴 CORREÇÃO: Removemos o "= accounts" traiçoeiro do parâmetro
    const reloadClients = async (currentAccounts) => {
        try {
            const res = await axios.get("https://orion-dewp.onrender.com/api/users");
            const data = res.data;

            // Se passarmos a lista de empresas (como no reloadCompanies), usamos essa.
            // Caso contrário, tentamos usar o estado "accounts" atual.
            const targetAccounts = currentAccounts || accounts;

            const mapped = data.users
                .filter(u => u.id_tipo === 3)
                .map(u => {
                    const associatedCompany = targetAccounts.find(acc =>
                        Number(acc.id) === Number(u.id_empresa)
                    );

                    return {
                        ...u,
                        id: u.id_Utilizador,
                        phone: u.telephone,
                        status: u.active ? "Ativo" : "Inativo",
                        companyName: associatedCompany ? associatedCompany.company : "Sem Empresa"
                    };
                });

            setClients(mapped);
        } catch (err) {
            console.error("Error loading clients:", err);
        }
    };

    const reloadCompanies = async () => {
        try {
            const res = await axios.get("https://orion-dewp.onrender.com/api/companies");
            const data = res.data;
            const mapped = data.companies.map(c => ({
                id: c.id,
                company: c.nome,
                status: c.status ? "Ativo" : "Inativo",
                securityManager: {
                    name: c.nomeResponsavelSeg || "",
                    email: c.emailResponsavelSeg || "",
                    phone: c.telefoneResponsavelSeg || ""
                },
                permanentContact: {
                    name: c.nomeContactoPerm || "",
                    email: c.emailContactoPerm || "",
                    phone: c.telefoneContactoPerm || ""
                },
                clients: (c.users || []).filter(u => u.id_tipo === 3).map(u => ({
                    name: u.name,
                    email: u.email,
                    phone: u.telephone
                }))
            }));

            setAccounts(mapped);
            // Passa explicitamente o mapeamento fresco para os clientes
            await reloadClients(mapped);
        } catch (err) {
            console.error("Error loading companies:", err);
        }
    };

    // 🔴 CORREÇÃO NO USEEFFECT: Adicionamos a dependência das accounts para que a função 
    // reloadClients se atualize sempre que as empresas mudarem no sistema!
    useEffect(() => {
        reloadAdmins();
        reloadManagers();
        reloadCompanies();
    }, []);

    // 🔴 ADICIONAR ESTE SEGUNDO USEEFFECT: Garante a sincronização automática dos clientes
    // sempre que a lista de empresas (accounts) terminar de carregar no React.
    useEffect(() => {
        if (accounts.length > 0) {
            reloadClients(accounts);
        }
    }, [accounts]);

    // 1. Primeiro ciclo de vida: Carrega dados independentes e as empresas
    useEffect(() => {
        reloadAdmins();
        reloadManagers();
        reloadCompanies();
    }, []);

    return (
        <div className="d-flex flex-column gap-4">
            <CompaniesTable accounts={accounts} setAccounts={setAccounts} reloadCompanies={reloadCompanies} />
            <AdminsTable admins={admins} setAdmins={setAdmins} reloadAdmins={reloadAdmins} />
            <ManagersTable managers={managers} setManagers={setManagers} reloadManagers={reloadManagers} />
            {/* Adicionada a prop accounts para o ClientsTable poder usar no dropdown de criação/edição */}
            <ClientsTable clients={clients} setClients={setClients} reloadClients={reloadClients} accounts={accounts} />
        </div>
    );
}


function CompaniesTable({ accounts, setAccounts, reloadCompanies }) {
    const getEmptyForm = () => ({
        company: "",
        status: "Ativo",
        securityManager: { name: "", email: "", phone: "" },
        permanentContact: { name: "", email: "", phone: "" },
    });

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(getEmptyForm());
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const setField = (f, v) => setForm((p) => ({ ...p, [f]: v }));
    const setSubField = (s, f, v) => setForm((p) => ({ ...p, [s]: { ...p[s], [f]: v } }));

    const setEField = (f, v) => setEditForm((p) => ({ ...p, [f]: v }));
    const setESubField = (s, f, v) => setEditForm((p) => ({ ...p, [s]: { ...p[s], [f]: v } }));

    const handleCreate = async () => {
        if (!form.company) return;
        try {
            const res = await axios.post("https://orion-dewp.onrender.com/api/companies", {
                nome: form.company,
                status: form.status === "Ativo",
                nomeResponsavelSeg: form.securityManager.name,
                emailResponsavelSeg: form.securityManager.email,
                telefoneResponsavelSeg: form.securityManager.phone,
                nomeContactoPerm: form.permanentContact.name,
                emailContactoPerm: form.permanentContact.email,
                telefoneContactoPerm: form.permanentContact.phone
            });
            if (res.data.success) {
                await reloadCompanies();
                setForm(getEmptyForm());
                setShowForm(false);
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const startEdit = (a) => {
        setEditingId(a.id);
        setEditForm({ ...a });
        setShowForm(false);
    };

    const cancelEdit = () => { setEditingId(null); setEditForm(null); };

    const saveEdit = async () => {
        if (!editForm.company) return;
        try {
            const res = await axios.put(`https://orion-dewp.onrender.com/api/companies/${editingId}`, {
                nome: editForm.company,
                status: editForm.status === "Ativo",
                nomeResponsavelSeg: editForm.securityManager.name,
                emailResponsavelSeg: editForm.securityManager.email,
                telefoneResponsavelSeg: editForm.securityManager.phone,
                nomeContactoPerm: editForm.permanentContact.name,
                emailContactoPerm: editForm.permanentContact.email,
                telefoneContactoPerm: editForm.permanentContact.phone
            });
            if (res.data.success) {
                await reloadCompanies();
                cancelEdit();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tens a certeza que desejas remover esta empresa?")) return;
        try {
            const res = await axios.delete(`https://orion-dewp.onrender.com/api/companies/${id}`);
            if (res.data.success) {
                await reloadCompanies();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const statusColor = (s) => s === "Ativo" ? "bg-success" : s === "Pendente" ? "bg-warning text-dark" : "bg-danger";

    return (
        <div className="card p-3 shadow-sm border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold">Empresas</h5>
                <button type="button" className="btn btn-sm btn-dark"
                    onClick={() => { setShowForm(!showForm); cancelEdit(); setForm(getEmptyForm()); }}>
                    {showForm ? "Cancelar" : "+ Nova Empresa"}
                </button>
            </div>

            {showForm && (
                <div className="bg-light p-3 border rounded mb-3">
                    <CompanyForm form={form} title="Nova Empresa" submitLabel="Criar Empresa"
                        setField={setField} setSubField={setSubField}
                        onSubmit={handleCreate} />
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>Empresa</th>
                            <th>Resp. Segurança</th>
                            <th>Contacto Perm.</th>
                            <th>Estado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((a) => {
                            // Criamos um array de elementos com chaves individuais para contornar o Fragment do React
                            const rows = [
                                <tr key={`row-${a.id}`}>
                                    <td className="fw-semibold text-dark">{a.company}</td>
                                    <td>{a.securityManager?.name || "—"}</td>
                                    <td>{a.permanentContact?.name || "—"}</td>
                                    <td><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(a)}>Editar</button>
                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id)}>Remover</button>
                                        </div>
                                    </td>
                                </tr>
                            ];

                            // Se estiver em modo de edição, adiciona a linha do formulário logo a seguir
                            if (editingId === a.id && editForm) {
                                rows.push(
                                    <tr key={`edit-${a.id}`}>
                                        <td colSpan={5} className="p-0">
                                            <div className="border border-warning rounded m-2 p-3 bg-white">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h6 className="mb-0 fw-bold text-warning">Editar — {a.company}</h6>
                                                    <button type="button" className="btn btn-sm btn-link text-secondary p-0 text-decoration-none" onClick={cancelEdit}>✕ Cancelar</button>
                                                </div>
                                                <CompanyForm form={editForm} title="" submitLabel="Guardar Alterações"
                                                    setField={setEField} setSubField={setESubField}
                                                    onSubmit={saveEdit} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }

                            return rows;
                        })}

                        {accounts.length === 0 && (
                            <tr><td colSpan={5} className="text-center text-muted py-4">Nenhuma empresa criada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


function ClientsTable({ clients, setClients, reloadClients, accounts }) {
    // 1. O estado inicial agora inclui o campo companyId vazio
    const getEmptyForm = () => ({
        name: "",
        email: "",
        phone: "",
        password: "",
        status: "Ativo",
        companyId: ""
    });

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(getEmptyForm());
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
        return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    };

    // 2. Ação de Criar Cliente com Chave Estrangeira da Empresa
    const handleCreate = async () => {
        if (!form.name || !form.email || !form.password || !form.companyId) {
            alert("Por favor, preencha o nome, email, password e selecione uma empresa.");
            return;
        }
        try {
            const res = await axios.post("https://orion-dewp.onrender.com/api/users", {
                name: form.name,
                email: form.email,
                password: form.password,
                telephone: form.phone,
                id_tipo: 3, // Tipo 3 para Clientes
                id_empresa: parseInt(form.companyId) // Envia o ID da Empresa selecionada
            });

            if (res.data.success) {
                await reloadClients(accounts); // Atualiza a lista geral
                setForm(getEmptyForm());
                setShowForm(false);
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const startEdit = (c) => {
        setEditingId(c.id_Utilizador || c.id);
        setEditForm({
            ...c,
            companyId: c.id_empresa || "" // Garante que o ID antigo fica selecionado no dropdown
        });
        setShowForm(false);
    };

    const cancelEdit = () => { setEditingId(null); setEditForm(null); };

    // 3. Ação de Guardar Alterações do Cliente
    const saveEdit = async () => {
        if (!editForm.name || !editForm.email || !editForm.companyId) {
            alert("Nome, Email e Empresa são obrigatórios.");
            return;
        }
        try {
            const res = await axios.put(`https://orion-dewp.onrender.com/api/users/${editingId}`, {
                name: editForm.name,
                email: editForm.email,
                telephone: editForm.phone,
                status: editForm.status,
                id_empresa: parseInt(editForm.companyId) // Atualiza a associação da empresa
            });

            if (res.data.success) {
                await reloadClients(accounts);
                cancelEdit();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem a certeza que deseja remover este cliente?")) return;
        try {
            const res = await axios.delete(`https://orion-dewp.onrender.com/api/users/${id}`);
            if (res.data.success) {
                await reloadClients(accounts);
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const statusColor = (s) => s === "Ativo" ? "bg-success" : "bg-danger";

    return (
        <div className="card p-3 shadow-sm border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold">Clientes</h5>
                <button type="button" className="btn btn-sm btn-dark"
                    onClick={() => { setShowForm(!showForm); cancelEdit(); setForm(getEmptyForm()); }}>
                    {showForm ? "Cancelar" : "+ Novo Cliente"}
                </button>
            </div>

            {/* Formulário de Criação */}
            {showForm && (
                <ClientPersonForm
                    form={form}
                    setForm={setForm}
                    title="Novo Cliente Corporativo"
                    submitLabel="Criar Cliente"
                    generatePassword={generatePassword}
                    onSubmit={handleCreate}
                    accounts={accounts}
                />
            )}

            <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                    <thead className="table-success">
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Empresa</th>
                            <th>Estado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c) => (
                            <React.Fragment key={c.id_Utilizador || c.id}>
                                <tr>
                                    <td className="fw-semibold">{c.name}</td>
                                    <td>{c.email}</td>
                                    <td>{c.phone || "—"}</td>
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {c.companyName || "Sem empresa"}
                                        </span>
                                    </td>
                                    <td><span className={`badge ${statusColor(c.status)}`}>{c.status}</span></td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(c)}>Editar</button>
                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id_Utilizador || c.id)}>Remover</button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Linha de Edição Inline */}
                                {editingId === (c.id_Utilizador || c.id) && editForm && (
                                    <tr>
                                        <td colSpan={6} className="p-0">
                                            <div className="border border-warning rounded m-2 p-3 bg-white">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h6 className="mb-0 fw-bold text-warning">Editar Cliente — {c.name}</h6>
                                                    <button type="button" className="btn btn-sm btn-link text-secondary p-0 text-decoration-none" onClick={cancelEdit}>✕ Cancelar</button>
                                                </div>
                                                <ClientPersonForm
                                                    form={editForm}
                                                    setForm={setEditForm}
                                                    title=""
                                                    submitLabel="Guardar Alterações"
                                                    generatePassword={generatePassword}
                                                    onSubmit={saveEdit}
                                                    isEdit={true}
                                                    accounts={accounts}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {clients.length === 0 && (
                            <tr><td colSpan={6} className="text-center text-muted py-3">Nenhum cliente cadastrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
function CompanyForm({ form, title, submitLabel, setField, setSubField, onSubmit }) {
    return (
        <>
            {title && <h6 className="mb-3">{title}</h6>}

            <div className="row g-2 mb-3">
                <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Nome da Empresa *</label>
                    <input className="form-control form-control-sm" placeholder="Ex: TechCorp Lda"
                        value={form.company} onChange={(e) => setField("company", e.target.value)} />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Estado</label>
                    <select className="form-select form-select-sm"
                        value={form.status} onChange={(e) => setField("status", e.target.value)}>
                        <option value="Ativo">Ativo</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Inativo">Inativo</option>
                    </select>
                </div>
            </div>
            <hr />

            <div className="mb-3">
                <label className="fw-semibold d-block mb-2" style={{ fontSize: 13 }}>Responsável de Segurança</label>
                <div className="row g-2">
                    {["name", "email", "phone"].map((f) => (
                        <div className="col-md-4" key={f}>
                            <label className="form-label" style={{ fontSize: 11 }}>
                                {f === "name" ? "Nome" : f === "email" ? "Email" : "Telefone"}
                            </label>
                            <input className="form-control form-control-sm"
                                placeholder={f === "name" ? "Nome" : f === "email" ? "email@empresa.com" : "+351 910 000 000"}
                                value={form.securityManager[f]}
                                onChange={(e) => setSubField("securityManager", f, e.target.value)} />
                        </div>
                    ))}
                </div>
            </div>
            <hr />

            <div className="mb-3">
                <label className="fw-semibold d-block mb-2" style={{ fontSize: 13 }}>Contacto Permanente</label>
                <div className="row g-2">
                    {["name", "email", "phone"].map((f) => (
                        <div className="col-md-4" key={f}>
                            <label className="form-label" style={{ fontSize: 11 }}>
                                {f === "name" ? "Nome" : f === "email" ? "Email" : "Telefone"}
                            </label>
                            <input className="form-control form-control-sm"
                                placeholder={f === "name" ? "Nome" : f === "email" ? "email@empresa.com" : "+351 910 000 000"}
                                value={form.permanentContact[f]}
                                onChange={(e) => setSubField("permanentContact", f, e.target.value)} />
                        </div>
                    ))}
                </div>
            </div>

            <button className="btn btn-sm btn-success" onClick={onSubmit}>
                {submitLabel}
            </button>
        </>
    );
}

// ==========================================
// SUB-FORMULÁRIO ADAPTADO COM DROPDOWN
// ==========================================
function ClientPersonForm({ form, setForm, title, submitLabel, generatePassword, onSubmit, isEdit = false, accounts }) {
    return (
        <div className="border rounded p-3 mb-4 bg-white">
            {title && <h6 className="mb-3 text-secondary fw-bold">{title}</h6>}
            <div className="row g-3">
                {[
                    { f: "name", label: "Nome Completo", type: "text", ph: "Nome do cliente" },
                    { f: "email", label: "Email", type: "email", ph: "cliente@empresa.com" },
                    { f: "phone", label: "Telefone", type: "tel", ph: "+351 9xx xxx xxx" },
                ].map(({ f, label, type, ph }) => (
                    <div className="col-md-4" key={f}>
                        <label className="form-label fw-semibold mb-1" style={{ fontSize: 12 }}>{label}</label>
                        <input type={type} className="form-control form-control-sm" placeholder={ph}
                            value={form[f] || ""} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
                    </div>
                ))}

                {/* DROPDOWN PARA ESCOLHER A EMPRESA */}
                <div className="col-md-4">
                    <label className="form-label fw-semibold mb-1 text-primary" style={{ fontSize: 12 }}>Empresa Pertencente *</label>
                    <select
                        className="form-select form-select-sm" // mudei para form-select-sm para combinar com os inputs
                        value={form.companyId || ""} // 🔴 CORREÇÃO: Evita erro de componente não controlado
                        onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                    >
                        <option value="">Selecione uma empresa...</option>
                        {accounts && accounts.map(acc => ( // 🔴 SEGURANÇA: Evita quebras se accounts for undefined
                            <option key={acc.id} value={acc.id}>{acc.company}</option>
                        ))}
                    </select>
                </div>

                {!isEdit ? (
                    <div className="col-md-4">
                        <label className="form-label fw-semibold mb-1" style={{ fontSize: 12 }}>Password</label>
                        <div className="input-group input-group-sm">
                            <input type="text" className="form-control form-control-sm" placeholder="Gere a password"
                                value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            <button type="button" className="btn btn-outline-secondary"
                                onClick={() => setForm({ ...form, password: generatePassword() })}>Gerar</button>
                        </div>
                    </div>
                ) : (
                    <div className="col-md-4">
                        <label className="form-label fw-semibold mb-1" style={{ fontSize: 12 }}>Password</label>
                        <input type="password" className="form-control form-control-sm bg-light" value="placeholder" disabled />
                    </div>
                )}

                <div className="col-md-4">
                    <label className="form-label fw-semibold mb-1" style={{ fontSize: 12 }}>Estado</label>
                    <select className="form-select form-select-sm"
                        value={form.status || "Ativo"} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option>Ativo</option>
                        <option>Inativo</option>
                    </select>
                </div>
            </div>
            <button type="button" className="btn btn-sm btn-success mt-3" onClick={onSubmit}>{submitLabel}</button>
        </div>
    );
}


function AdminsTable({ admins, setAdmins, reloadAdmins }) {
    const getEmptyForm = () => ({ name: "", email: "", phone: "", password: "", status: "Ativo" });
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(getEmptyForm());
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    };

    const handleCreate = async () => {
        if (!form.name || !form.email || !form.password) {
            alert("Please fill in name, email and password before creating.");
            return;
        }
        try {
            const res = await axios.post("https://orion-dewp.onrender.com/api/users", {
                name: form.name,
                email: form.email,
                password: form.password,
                telephone: form.phone,
                id_tipo: 1
            });
            if (res.data.success) {
                await reloadAdmins();
                setForm(getEmptyForm());
                setShowForm(false);
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const startEdit = (a) => {
        setEditingId(a.id_Utilizador || a.id);
        setEditForm({ ...a });
        setShowForm(false);
    };
    const cancelEdit = () => { setEditingId(null); setEditForm(null); };

    const saveEdit = async () => {
        if (!editForm.name || !editForm.email) return;
        try {
            const res = await axios.put(`https://orion-dewp.onrender.com/api/users/${editingId}`, {
                name: editForm.name,
                email: editForm.email,
                telephone: editForm.phone,
                status: editForm.status
            });
            if (res.data.success) {
                await reloadAdmins();
                cancelEdit();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`https://orion-dewp.onrender.com/api/users/${id}`);
            if (res.data.success) {
                await reloadAdmins();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const statusColor = (s) => s === "Ativo" ? "bg-success" : "bg-danger";

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Administradores</h5>
                <button type="button" className="btn btn-sm btn-dark"
                    onClick={() => { setShowForm(!showForm); cancelEdit(); setForm(getEmptyForm()); }}>
                    {showForm ? "Cancelar" : "+ Novo Administrador"}
                </button>
            </div>
            {showForm && (
                <PersonForm form={form} setForm={setForm} title="Novo Administrador"
                    submitLabel="Criar Administrador" generatePassword={generatePassword} onSubmit={handleCreate} />
            )}
            <table className="table table-hover mb-0">
                <thead className="table-primary">
                    <tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Estado</th><th>Ações</th></tr>
                </thead>
                <tbody>
                    {admins.map((a) => (
                        <React.Fragment key={a.id_Utilizador || a.id}>
                            <tr key={a.id}>
                                <td className="fw-semibold">{a.name}</td>
                                <td>{a.email}</td>
                                <td>{a.phone}</td>
                                <td><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></td>
                                <td>
                                    <div className="d-flex gap-1">
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(a)}>Editar</button>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id_Utilizador || a.id)}>Remover</button>
                                    </div>
                                </td>
                            </tr>
                            {editingId === (a.id_Utilizador || a.id) && editForm && (
                                <tr key={`edit-${a.id}`}>
                                    <td colSpan={5} className="p-0">
                                        <div className="border border-warning rounded m-2 p-3 bg-white">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0">Editar — {a.name}</h6>
                                                <button type="button" className="btn btn-sm btn-link text-secondary p-0" onClick={cancelEdit}>✕ Cancelar</button>
                                            </div>
                                            <PersonForm form={editForm} setForm={setEditForm} title=""
                                                submitLabel="Guardar Alterações" generatePassword={generatePassword}
                                                onSubmit={saveEdit} isEdit={true} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    {admins.length === 0 && (
                        <tr><td colSpan={5} className="text-center text-muted py-3">Nenhum administrador criado.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function ManagersTable({ managers, setManagers, reloadManagers }) {
    const getEmptyForm = () => ({ name: "", email: "", phone: "", password: "", status: "Ativo" });
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(getEmptyForm());
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    };

    const handleCreate = async () => {
        if (!form.name || !form.email || !form.password) {
            alert("Please fill in name, email and password before creating.");
            return;
        }
        try {
            const res = await axios.post("https://orion-dewp.onrender.com/api/users", {
                name: form.name,
                email: form.email,
                password: form.password,
                telephone: form.phone,
                id_tipo: 2
            });
            if (res.data.success) {
                await reloadManagers();
                setForm(getEmptyForm());
                setShowForm(false);
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const startEdit = (m) => {
        setEditingId(m.id_Utilizador || m.id);
        setEditForm({ ...m });
        setShowForm(false);
    };
    const cancelEdit = () => { setEditingId(null); setEditForm(null); };

    const saveEdit = async () => {
        if (!editForm.name || !editForm.email) return;
        try {
            const res = await axios.put(`https://orion-dewp.onrender.com/api/users/${editingId}`, {
                name: editForm.name,
                email: editForm.email,
                telephone: editForm.phone,
                status: editForm.status
            });
            if (res.data.success) {
                await reloadManagers();
                cancelEdit();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`https://orion-dewp.onrender.com/api/users/${id}`);
            if (res.data.success) {
                await reloadManagers();
            } else {
                alert("Error: " + res.data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const statusColor = (s) => s === "Ativo" ? "bg-success" : "bg-danger";

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Gestores</h5>
                <button type="button" className="btn btn-sm btn-dark"
                    onClick={() => { setShowForm(!showForm); cancelEdit(); setForm(getEmptyForm()); }}>
                    {showForm ? "Cancelar" : "+ Novo Gestor"}
                </button>
            </div>
            {showForm && (
                <PersonForm form={form} setForm={setForm} title="Novo Gestor"
                    submitLabel="Criar Gestor" generatePassword={generatePassword} onSubmit={handleCreate} />
            )}
            <table className="table table-hover mb-0">
                <thead className="table-info">
                    <tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Estado</th><th>Ações</th></tr>
                </thead>
                <tbody>
                    {managers.map((m) => (
                        <React.Fragment key={m.id_Utilizador || m.id}>
                            <tr key={m.id}>
                                <td className="fw-semibold">{m.name}</td>
                                <td>{m.email}</td>
                                <td>{m.phone}</td>
                                <td><span className={`badge ${statusColor(m.status)}`}>{m.status}</span></td>
                                <td>
                                    <div className="d-flex gap-1">
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(m)}>Editar</button>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id_Utilizador || m.id)}>Remover</button>
                                    </div>
                                </td>
                            </tr>
                            {editingId === (m.id_Utilizador || m.id) && editForm && (
                                <tr key={`edit-${m.id}`}>
                                    <td colSpan={5} className="p-0">
                                        <div className="border border-warning rounded m-2 p-3 bg-white">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0">Editar — {m.name}</h6>
                                                <button type="button" className="btn btn-sm btn-link text-secondary p-0" onClick={cancelEdit}>✕ Cancelar</button>
                                            </div>
                                            <PersonForm form={editForm} setForm={setEditForm} title=""
                                                submitLabel="Guardar Alterações" generatePassword={generatePassword}
                                                onSubmit={saveEdit} isEdit={true} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    {managers.length === 0 && (
                        <tr><td colSpan={5} className="text-center text-muted py-3">Nenhum gestor criado.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function PersonForm({ form, setForm, title, submitLabel, generatePassword, onSubmit, isEdit = false }) {
    return (
        <div className="border rounded p-3 mb-4 bg-white">
            {title && <h6 className="mb-3">{title}</h6>}
            <div className="row g-3">
                {[
                    { f: "name", label: "Nome Completo", type: "text", ph: "Nome completo" },
                    { f: "email", label: "Email", type: "email", ph: "utilizador@cyberbox.pt" },
                    { f: "phone", label: "Telefone", type: "tel", ph: "+351 910 000 000" },
                ].map(({ f, label, type, ph }) => (
                    <div className="col-md-4" key={f}>
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>{label}</label>
                        <input type={type} className="form-control form-control-sm" placeholder={ph}
                            value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
                    </div>
                ))}

                {!isEdit ? (
                    <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Password</label>
                        <div className="input-group input-group-sm">
                            <input type="text" className="form-control form-control-sm" placeholder="Gere uma password"
                                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            <button type="button" className="btn btn-outline-secondary"
                                onClick={() => setForm({ ...form, password: generatePassword() })}>Gerar</button>
                        </div>
                    </div>
                ) : (
                    <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Password</label>
                        <input type="password" className="form-control form-control-sm bg-light" value="placeholder" disabled />
                        <small className="text-muted" style={{ fontSize: 11 }}>A password não pode ser alterada aqui.</small>
                    </div>
                )}

                <div className="col-md-4">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Estado</label>
                    <select className="form-select form-select-sm"
                        value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option>Ativo</option>
                        <option>Inativo</option>
                    </select>
                </div>
            </div>
            <button type="button" className="btn btn-sm btn-success mt-3" onClick={onSubmit}>{submitLabel}</button>
        </div>
    );
}

function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [filter, setFilter] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [messages, setMessages] = useState({});
    const [replyText, setReplyText] = useState("");

    // Estados para o Modal de Atribuição do Admin
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [managers, setManagers] = useState([]);

    const managerId = Number(localStorage.getItem("userId") || 1);
    
    // 🌐 Definido o URL base diretamente para evitar o "API is not defined"
    const BACKEND_URL = "https://orion-dewp.onrender.com/api";

    const reloadTickets = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BACKEND_URL}/questions`);
            setTickets(res.data.questions || []);
        } catch (err) {
            console.error("Erro ao carregar tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { reloadTickets(); }, []);

    const openAssignModal = async (ticketId) => {
        setSelectedTicketId(ticketId);
        try {
            const res = await axios.get(`${BACKEND_URL}/users`);
            const onlyManagers = res.data.users.filter(u => u.id_tipo === 2);
            setManagers(onlyManagers);
        } catch (err) {
            console.error("Erro ao carregar managers:", err);
        }
        setAssignModalOpen(true);
    };

    const handleAssign = async (managerId, managerName) => {
        try {
            await axios.put(`${BACKEND_URL}/questions/${selectedTicketId}/assign`, { 
                assignedToId: managerId 
            });
            
            setAssignModalOpen(false);
            setSelectedTicketId(null);
            await reloadTickets();
        } catch (err) {
            console.error("Erro ao atribuir:", err);
            alert("Erro ao atribuir gestor ao ticket. Tenta novamente.");
        }
    };

    const handleExpand = async (id) => {
        if (expandedId === id) { setExpandedId(null); return; }
        setExpandedId(id);
        if (!messages[id]) {
            try {
                const res = await axios.get(`${BACKEND_URL}/questions/${id}/messages`);
                setMessages(prev => ({ ...prev, [id]: res.data.messages || [] }));
            } catch (err) {
                console.error("Erro ao carregar mensagens:", err);
            }
        }
    };

    const handleReply = async (ticketId) => {
        if (!replyText.trim()) return;
        try {
            await axios.post(`${BACKEND_URL}/questions/${ticketId}/reply`, {
                message: replyText,
                userId: Number(managerId),
            });
            setReplyText("");
            const res = await axios.get(`${BACKEND_URL}/questions/${ticketId}/messages`);
            setMessages(prev => ({ ...prev, [ticketId]: res.data.messages || [] }));
            await reloadTickets();
        } catch (err) {
            alert("Erro ao enviar resposta.");
        }
    };

    const handleClose = async (id) => {
        if (!window.confirm("Fechar este ticket?")) return;
        try {
            await axios.put(`${BACKEND_URL}/questions/${id}/close`);
            await reloadTickets();
        } catch (err) {
            alert("Erro ao fechar ticket.");
        }
    };

    const STATUS_COLOR = { "Pendente": "warning", "Respondido": "success", "Fechado": "secondary" };

    const filtered = filter === "Todos" ? tickets : tickets.filter(t => t.status === filter);

    if (loading) return <div className="text-center my-5"><p className="text-muted">A carregar tickets...</p></div>;

    return (
        <div className="d-flex flex-column gap-3 text-start">
            {/* Contadores */}
            <div className="row g-3 mb-1">
                {[
                    { label: "Total", value: tickets.length, color: "dark" },
                    { label: "Pendentes", value: tickets.filter(t => t.status === "Pendente").length, color: "warning" },
                    { label: "Respondidos", value: tickets.filter(t => t.status === "Respondido").length, color: "success" },
                ].map(s => (
                    <div className="col" key={s.label}>
                        <div className="card p-3 text-center">
                            <div className="text-muted small">{s.label}</div>
                            <h4 className={`fw-bold mb-0 text-${s.color}`}>{s.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filtros */}
            <div className="card p-3">
                <div className="d-flex gap-2">
                    {["Todos", "Pendente", "Respondido"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`btn btn-sm ${filter === f ? "btn-dark" : "btn-outline-secondary"}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista */}
            {filtered.length === 0 ? (
                <div className="text-center text-muted py-5 border rounded bg-white">
                    <div style={{ fontSize: 32 }}>🎫</div>
                    <p className="mt-2 mb-0">Nenhum ticket encontrado.</p>
                </div>
            ) : (
                filtered.map(t => (
                    <div
                        key={t.id}
                        className="card p-3 border-start border-4"
                        style={{ borderLeftColor: t.status === "Respondido" ? "#198754" : t.status === "Fechado" ? "#6c757d" : "#ffc107" }}
                    >
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                    <span className="fw-bold">#{t.id} — {t.subject}</span>
                                    <span className={`badge bg-${STATUS_COLOR[t.status] || "secondary"}`} style={{ fontSize: 10 }}>
                                        {t.status}
                                    </span>
                                </div>
                                <div className="text-muted small">
                                    👤 {t.createdBy || "—"} · 📅 {t.date}
                                    {t.assignedTo && t.assignedTo !== "Sem atribuição" && (
                                        <> · Atribuído a <strong>{t.assignedTo}</strong></>
                                    )}
                                </div>

                                {/* Conversa expandida */}
                                {expandedId === t.id && (
                                    <div className="mt-3 border-top pt-3">
                                        <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: 280, overflowY: "auto" }}>
                                            {(messages[t.id] || []).map(m => {
                                                const isManager = m.userId === Number(managerId);
                                                return (
                                                    <div
                                                        key={m.id}
                                                        className={`d-flex flex-column ${isManager ? "align-items-end" : "align-items-start"}`}
                                                    >
                                                        <div
                                                            className={`p-2 rounded small ${isManager ? "bg-primary text-white" : "bg-light border text-dark"}`}
                                                            style={{ maxWidth: "70%" }}
                                                        >
                                                            <div className="fw-semibold mb-1" style={{ fontSize: 11, opacity: 0.8 }}>
                                                                {isManager ? "Eu" : m.sender?.name || "Cliente"}
                                                            </div>
                                                            {m.message}
                                                            <div className={`mt-1 ${isManager ? "text-white opacity-75" : "text-muted"}`} style={{ fontSize: 10 }}>
                                                                {m.sentAt ? new Date(m.sentAt).toLocaleString("pt-PT") : ""}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {t.status !== "Fechado" && (
                                            <div className="d-flex gap-2">
                                                <input
                                                    className="form-control form-control-sm"
                                                    placeholder="Escreve uma resposta..."
                                                    value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                    onKeyDown={e => e.key === "Enter" && handleReply(t.id)}
                                                />
                                                <button className="btn btn-sm btn-dark" onClick={() => handleReply(t.id)}>
                                                    Enviar
                                                </button>
                                            </div>
                                        )}
                                        {t.status === "Fechado" && (
                                            <div className="alert alert-secondary py-2 small mb-0">🔒 Ticket fechado.</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Ações */}
                            <div className="d-flex flex-column gap-1 ms-3">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleExpand(t.id)}
                                >
                                    {expandedId === t.id ? "Fechar" : "Responder"}
                                </button>
                                
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => openAssignModal(t.id)}
                                >
                                    + Atribuir
                                </button>

                                {t.status !== "Fechado" && (
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleClose(t.id)}>
                                        Fechar ticket
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* MODAL DE ATRIBUIÇÃO */}
            {assignModalOpen && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-dark">Atribuir gestor ao ticket</h5>
                                <button className="btn-close" onClick={() => setAssignModalOpen(false)} />
                            </div>
                            <div className="modal-body text-dark">
                                <p className="text-muted small mb-3">Seleciona um gestor:</p>
                                <div className="d-flex flex-column gap-2">
                                    {managers.map(m => (
                                        <div
                                            key={m.id_Utilizador || m.id}
                                            className="d-flex align-items-center gap-3 p-2 border rounded"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleAssign(m.id_Utilizador || m.id, m.name)}
                                        >
                                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                                style={{ width: 36, height: 36, fontSize: 13 }}>
                                                {(m.name || "?").substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="fw-medium" style={{ fontSize: 14 }}>{m.name}</div>
                                                <div className="text-muted" style={{ fontSize: 12 }}>Gestor</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-sm btn-secondary" onClick={() => setAssignModalOpen(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Requests() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("Todos");
    const [loading, setLoading] = useState(true);

    // Tradutor de estados do Sequelize ENUM ('open', 'in_progress', 'closed') para o teu Layout
    const translateStatus = (dbStatus) => {
        switch (dbStatus) {
            case "open": return "Pendente";
            case "in_progress": return "Em Execução";
            case "closed": return "Concluídos";
            default: return "Pendente";
        }
    };

    const reloadRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get("https://orion-dewp.onrender.com/api/requests");
            const data = response.data;

            if (data.success && data.requests) {
                const mappedRequests = data.requests.map(r => ({
                    id: r.id,
                    title: r.subject,
                    description: r.description,
                    company: r.company,
                    date: r.date,
                    type: r.type,
                    subtype: r.subtype,
                    assignedTo: r.assignedToName,
                    assignedToId: r.assignedToId, // ✅ necessário para o manager filtrar
                    status: r.status,             // ✅ 'open', 'in_progress', 'closed'
                    statusLabel: r.statusLabel    // ✅ 'Pendente', 'Em Execução', 'Concluído'
                }));
                setRequests(mappedRequests);
            }
        } catch (err) {
            console.error("Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reloadRequests();
    }, []);

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [managers, setManagers] = useState([]);

    const openAssignModal = async (requestId) => {
        setSelectedRequestId(requestId);
        try {
            const res = await axios.get("https://orion-dewp.onrender.com/api/users");
            const onlyManagers = res.data.users.filter(u => u.id_tipo === 2);
            setManagers(onlyManagers);
        } catch (err) {
            console.error("Erro ao carregar managers:", err);
        }
        setAssignModalOpen(true);
    };

    const handleAssign = async (managerId, managerName) => {
        try {
            await axios.put(
                `https://orion-dewp.onrender.com/api/requests/${selectedRequestId}/assign`,
                { assignedToId: managerId }
            );
            setRequests(prev =>
                prev.map(r =>
                    r.id === selectedRequestId
                        ? { ...r, assignedTo: managerName }
                        : r
                )
            );

            setAssignModalOpen(false);
            setSelectedRequestId(null);
        } catch (err) {
            console.error("Erro ao atribuir:", err);
            alert("Erro ao atribuir manager. Tenta novamente.");
        }
    };

    const totalRequests = requests.length;
    const countByStatus = (status) => requests.filter(r => r.status === status).length;

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "open": return "bg-warning text-dark";
            case "in_progress": return "bg-info text-dark";
            case "closed": return "bg-secondary";
            default: return "bg-primary";
        }
    };

    if (loading) {
        return <div className="text-center my-5 text-dark"><h5>A carregar gestão de pedidos com Axios... 🚀</h5></div>;
    }

    const FILTER_MAP = {
        "Todos": null,
        "Por Atribuir": "open",
        "Em Execução": "in_progress",
        "Concluídos": "closed",
    };

    const filteredRequests = filter === "Todos"
        ? requests
        : requests.filter(r => r.status === FILTER_MAP[filter]);


    return (
        <div className="d-flex flex-column gap-4 text-dark text-start">
            <div>
                <h3 className="fw-bold mb-1">Gestão de Pedidos</h3>
                <p className="text-muted small">Gerir pedidos dos clientes</p>
            </div>

            {/* --- Summary Status Cards --- */}
            <div className="row g-3">
                <div className="col">
                    <div className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
                        <div>
                            <div className="text-muted small">Total</div>
                            <h4 className="fw-bold m-0">{totalRequests}</h4>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
                        <div>
                            <div className="text-muted small">Por Atribuir</div>
                            <h4 className="fw-bold text-warning m-0">{countByStatus("open")}</h4>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
                        <div>
                            <div className="text-muted small">Em Execução</div>
                            <h4 className="fw-bold text-info m-0">{countByStatus("in_progress")}</h4>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
                        <div>
                            <div className="text-muted small">Concluídos</div>
                            <h4 className="fw-bold text-secondary m-0">{countByStatus("closed")}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Filter Tab Menu --- */}
            <div className="card p-3 shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-2 text-muted small fw-semibold">
                    <span>Filtros</span>
                </div>
                <div className="d-flex gap-2">
                    {["Todos", "Por Atribuir", "Em Execução", "Concluídos"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`btn btn-sm px-3 ${filter === f ? "btn-primary" : "btn-light border text-secondary"}`}
                        >
                            {f}
                            {f !== "Todos" && countByStatus(FILTER_MAP[f]) > 0 && ` (${countByStatus(FILTER_MAP[f])})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Request Row Items View --- */}
            <div className="d-flex flex-column gap-2">
                {filteredRequests.map((request) => (
                    <div key={request.id} className="card p-3 shadow-sm bg-white d-flex flex-row justify-content-between align-items-center border-start border-4 border-info">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <h6 className="fw-bold m-0">{request.title}</h6>
                                <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                                    {request.statusLabel}
                                </span>
                            </div>
                            <p className="text-muted small m-0 mb-2">{request.description}</p>
                            <div className="d-flex align-items-center gap-3 text-secondary" style={{ fontSize: "12px" }}>
                                <span>👤 {request.company}</span>
                                <span>📅 {request.date}</span>
                                {request.subtype && <span className="text-dark bg-light px-1 rounded">🏷️ Subtipo: {request.subtype}</span>}
                                <span>🛠️ {request.type}</span>
                                <span className="text-primary fw-medium">Atribuído: {request.assignedTo}</span>
                            </div>
                        </div>
                        <div>
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => openAssignModal(request.id)}
                                >
                                    + Atribuir
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredRequests.length === 0 && (
                    <div className="text-center text-muted p-4 bg-white border rounded">
                        Nenhum pedido encontrado com o estado atual selecionado.
                    </div>
                )}
            </div>

            {assignModalOpen && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Atribuir gestor ao ticket</h5>
                                <button className="btn-close" onClick={() => setAssignModalOpen(false)} />
                            </div>
                            <div className="modal-body">
                                <p className="text-muted small mb-3">Seleciona um gestor:</p>
                                <div className="d-flex flex-column gap-2">
                                    {managers.map(m => (
                                        <div
                                            key={m.id_Utilizador}
                                            className="d-flex align-items-center gap-3 p-2 border rounded"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleAssign(m.id_Utilizador, m.name)}
                                        >
                                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                                style={{ width: 36, height: 36, fontSize: 13 }}>
                                                {(m.name || "?").substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="fw-medium" style={{ fontSize: 14 }}>{m.name}</div>
                                                <div className="text-muted" style={{ fontSize: 12 }}>Gestor</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-sm btn-secondary" onClick={() => setAssignModalOpen(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Docs() {
    return (
        <div className="card p-3">
            <h5>Documentos</h5>
            <p>Repositório de ficheiros</p>
        </div>
    );
}

function Settings() {
    return (
        <div className="card p-3">
            <h5>Configurações</h5>
            <div className="mb-3">
                <label className="form-label">Nome</label>
                <input className="form-control" defaultValue="Admin User" />
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" defaultValue="admin@cyberbox.pt" />
            </div>
            <button type="button" className="btn btn-dark">Guardar</button>
        </div>
    );
}


function Content() {
    const [pages, setPages] = useState([]);
    const [editing, setEditing] = useState(null);
    const [text, setText] = useState("");

    const reloadContent = async () => {
        try {
            const res = await fetch("https://orion-dewp.onrender.com/api/content");
            const data = await res.json();
            setPages(data);
        } catch (err) {
            console.error("Erro ao carregar conteúdos:", err);
        }
    };

    useEffect(() => { reloadContent(); }, []);

    const handleEdit = (item) => { setEditing(item.id); setText(item.content); };

    const handleSave = async (id) => {
        try {
            const res = await fetch(`https://orion-dewp.onrender.com/api/content/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: text })
            });
            const data = await res.json();
            if (data.success) {
                await reloadContent();
                setEditing(null);
            } else {
                alert("Erro ao guardar: " + (data.message || "Erro desconhecido"));
            }
        } catch (err) {
            alert("Erro de ligação: " + err.message);
        }
    };

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Gestão de Conteúdo</h5>
                <span className="badge bg-secondary">{pages.length} secções</span>
            </div>
            <table className="table">
                <thead>
                    <tr><th>Página</th><th>Secção</th><th>Conteúdo</th><th>Atualizado</th><th>Ação</th></tr>
                </thead>
                <tbody>
                    {pages.map((item) => (
                        <tr key={item.id}>
                            <td><span className="badge bg-dark">{item.page}</span></td>
                            <td>{item.section}</td>
                            <td style={{ maxWidth: 250 }}>
                                {editing === item.id
                                    ? <textarea className="form-control form-control-sm" rows={2}
                                        value={text} onChange={(e) => setText(e.target.value)} />
                                    : <span className="text-muted" style={{ fontSize: 13 }}>{item.content}</span>}
                            </td>
                            <td style={{ fontSize: 13, color: "#6b7280" }}>{item.updated}</td>
                            <td>
                                {editing === item.id ? (
                                    <>
                                        <button type="button" className="btn btn-sm btn-success me-1" onClick={() => handleSave(item.id)}>Guardar</button>
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setEditing(null)}>Cancelar</button>
                                    </>
                                ) : (
                                    <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => handleEdit(item)}>Editar</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {pages.length === 0 && (
                        <tr><td colSpan={5} className="text-center text-muted py-3">A carregar...</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}