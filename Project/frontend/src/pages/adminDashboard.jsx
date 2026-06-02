import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

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
            {/* SIDEBAR */}
            <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: 250 }}>
                <h4 className="mb-4">CyberBox</h4>
                {nav.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`btn w-100 mb-2 text-start ${active === item.id ? "btn-primary" : "btn-outline-light"}`}
                    >
                        {item.label}
                    </button>
                ))}
                <div className="mt-auto pt-4 small text-secondary">© 2026 CyberBox</div>
            </div>

            {/* MAIN */}
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

/* ───────────────────────── DASHBOARD ───────────────────────── */
function Dashboard() {
    return (
        <>
            <div className="row g-3 mb-4">
                <Card title="Utilizadores" value="24" color="primary" />
                <Card title="Tickets" value="7" color="danger" />
                <Card title="Pedidos" value="12" color="warning" />
                <Card title="Documentos" value="38" color="success" />
            </div>
            <div className="card p-3">
                <h6>Atividade recente</h6>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Admin fez login</li>
                    <li className="list-group-item">Ticket #T002 atualizado</li>
                    <li className="list-group-item">Novo utilizador criado</li>
                </ul>
            </div>
        </>
    );
}

/* ───────────────────────── ACCOUNTS ───────────────────────── */
function Accounts() {
    const [accounts, setAccounts] = useState([
        {
            id: 1,
            company: "TechCorp",
            clients: [{ name: "João Pereira", email: "joao@techcorp.com", phone: "+351 910 000 001" }],
            securityManager: { name: "Carlos Silva", email: "carlos@techcorp.com", phone: "+351 910 000 002" },
            permanentContact: { name: "Ana Costa", email: "ana@techcorp.com", phone: "+351 910 000 003" },
            status: "Ativo",
        },
    ]);
    const [admins, setAdmins] = useState([
        { id: 1, name: "Maria Admin", email: "maria@cyberbox.pt", phone: "+351 910 000 010", status: "Ativo" },
    ]);
    const [managers, setManagers] = useState([
        { id: 1, name: "Rui Gestor", email: "rui@cyberbox.pt", phone: "+351 910 000 020", status: "Ativo" },
    ]);

    return (
        <div className="d-flex flex-column gap-4">
            <CompaniesTable accounts={accounts} setAccounts={setAccounts} />
            <AdminsTable admins={admins} setAdmins={setAdmins} />
            <ManagersTable managers={managers} setManagers={setManagers} />
        </div>
    );
}

/* ─────────────────── TABELA EMPRESAS ─────────────────── */
function CompaniesTable({ accounts, setAccounts }) {
    const emptyForm = {
        company: "", status: "Ativo",
        clients: [{ name: "", email: "", phone: "" }],
        securityManager: { name: "", email: "", phone: "" },
        permanentContact: { name: "", email: "", phone: "" },
    };

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    /* helpers create */
    const setField = (f, v) => setForm((p) => ({ ...p, [f]: v }));
    const setSubField = (s, f, v) => setForm((p) => ({ ...p, [s]: { ...p[s], [f]: v } }));
    const setClient = (i, f, v) => setForm((p) => { const c = [...p.clients]; c[i] = { ...c[i], [f]: v }; return { ...p, clients: c }; });
    const addClient = () => setForm((p) => ({ ...p, clients: [...p.clients, { name: "", email: "", phone: "" }] }));
    const removeClient = (i) => setForm((p) => ({ ...p, clients: p.clients.filter((_, idx) => idx !== i) }));

    /* helpers edit */
    const setEField = (f, v) => setEditForm((p) => ({ ...p, [f]: v }));
    const setESubField = (s, f, v) => setEditForm((p) => ({ ...p, [s]: { ...p[s], [f]: v } }));
    const setEClient = (i, f, v) => setEditForm((p) => { const c = [...p.clients]; c[i] = { ...c[i], [f]: v }; return { ...p, clients: c }; });
    const addEClient = () => setEditForm((p) => ({ ...p, clients: [...p.clients, { name: "", email: "", phone: "" }] }));
    const removeEClient = (i) => setEditForm((p) => ({ ...p, clients: p.clients.filter((_, idx) => idx !== i) }));

    const handleCreate = () => {
        if (!form.company) return;
        setAccounts((prev) => [...prev, { id: Date.now(), ...form }]);
        setForm(emptyForm);
        setShowForm(false);
    };

    const startEdit = (a) => {
        setEditingId(a.id);
        setEditForm({ ...a, clients: a.clients.map(c => ({ ...c })) });
        setShowForm(false);
    };

    const cancelEdit = () => { setEditingId(null); setEditForm(null); };

    const saveEdit = () => {
        if (!editForm.company) return;
        setAccounts((prev) => prev.map((a) => a.id === editingId ? { ...editForm } : a));
        cancelEdit();
    };

    const statusColor = (s) => s === "Ativo" ? "bg-success" : s === "Pendente" ? "bg-warning text-dark" : "bg-danger";

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Empresas</h5>
                <button className="btn btn-sm btn-dark" onClick={() => { setShowForm(!showForm); cancelEdit(); }}>
                    {showForm ? "Cancelar" : "+ Nova Empresa"}
                </button>
            </div>

            {showForm && (
                <CompanyForm
                    form={form} title="Nova Empresa" submitLabel="Criar Empresa"
                    setField={setField} setSubField={setSubField}
                    setClient={setClient} addClient={addClient} removeClient={removeClient}
                    onSubmit={handleCreate}
                />
            )}

            <table className="table table-hover mb-0">
                <thead className="table-dark">
                    <tr>
                        <th>Empresa</th><th>Clientes</th><th>Resp. Segurança</th>
                        <th>Contacto Perm.</th><th>Estado</th><th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((a, index) => (
                        <tr key={a.id || index}>
                            <td className="fw-semibold">{a.company}</td>
                            <td>{a.clients.length} cliente(s)</td>
                            <td>{a.securityManager.name}</td>
                            <td>{a.permanentContact.name}</td>
                            <td><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></td>
                            <td>
                                <div className="d-flex gap-1">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(a)}>Editar</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => setAccounts(accounts.filter((x) => x.id !== a.id))}>Remover</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {accounts.length === 0 && (
                        <tr><td colSpan={6} className="text-center text-muted py-3">Nenhuma empresa criada.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

/* ── Formulário reutilizável de empresa ── */
function CompanyForm({ form, title, submitLabel, setField, setSubField, setClient, addClient, removeClient, onSubmit }) {
    return (
        <div className="border rounded p-3 mb-4 bg-white">
            {title && <h6 className="mb-3">{title}</h6>}
            <div className="row g-2 mb-3">
                <div className="col-md-8">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Nome da Empresa *</label>
                    <input className="form-control form-control-sm" placeholder="Ex: TechCorp Lda"
                        value={form.company} onChange={(e) => setField("company", e.target.value)} />
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Estado</label>
                    <select className="form-select form-select-sm"
                        value={form.status} onChange={(e) => setField("status", e.target.value)}>
                        <option>Ativo</option>
                        <option>Inativo</option>
                    </select>
                </div>
            </div>
            <hr />
            <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="fw-semibold" style={{ fontSize: 13 }}>Clientes</label>
                    <button className="btn btn-sm btn-outline-dark" onClick={addClient}>+ Adicionar Cliente</button>
                </div>
                {form.clients.map((client, i) => (
                    <div className="row g-2 mb-2 align-items-end" key={i}>
                        <div className="col-md-3">
                            <input className="form-control form-control-sm" placeholder="Nome"
                                value={client.name} onChange={(e) => setClient(i, "name", e.target.value)} />
                        </div>
                        <div className="col-md-4">
                            <input className="form-control form-control-sm" placeholder="email@empresa.com"
                                value={client.email} onChange={(e) => setClient(i, "email", e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <input className="form-control form-control-sm" placeholder="+351 910 000 000"
                                value={client.phone} onChange={(e) => setClient(i, "phone", e.target.value)} />
                        </div>
                        <div className="col-md-2">
                            {form.clients.length > 1 && (
                                <button className="btn btn-sm btn-outline-danger w-100" onClick={() => removeClient(i)}>Remover</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <hr />
            <button className="btn btn-sm btn-success" onClick={onSubmit}>{submitLabel}</button>
        </div>
    );
}

/* ─────────────────── TABELA ADMINISTRADORES ─────────────────── */
function AdminsTable({ admins, setAdmins }) {
    const emptyForm = { name: "", email: "", phone: "", password: "", status: "Ativo" };
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    };

    // ✨ FUNÇÃO ATUALIZADA INTEGRADA COM O BANCO DE DADOS ATRAVÉS DA API ✨
    const handleCreate = async () => {
        if (!form.name || !form.email) {
            alert("Por favor, preencha o Nome e o Email.");
            return;
        }

        try {
            const res = await fetch("https://orion-dewp.onrender.com/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password || generatePassword(), // Envia uma senha gerada se estiver em branco
                    telephone: form.phone,
                    id_tipo: 1 // Tipo 1 para Administradores
                })
            });

            const data = await res.json();

            if (data.success || data.id || data.user) {
                // Monta o objeto de forma segura extraindo o ID criado no banco de dados do Neon
                const novoAdmin = {
                    id: data.user?.id || data.id || Date.now(),
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    status: form.status
                };

                setAdmins((prev) => [...prev, novoAdmin]);
                setForm(emptyForm);
                setShowForm(false);
                alert("Administrador criado e salvo com sucesso no banco de dados!");
            } else {
                alert(data.message || "O servidor recusou a criação do utilizador.");
            }
        } catch (err) {
            console.error("Erro no fetch:", err);
            alert("Erro ao conectar à API do Render. Verifique os logs.");
        }
    };

    const startEdit = (a) => { setEditingId(a.id); setEditForm({ ...a }); setShowForm(false); };
    const cancelEdit = () => { setEditingId(null); setEditForm(null); };
    const saveEdit = () => {
        if (!editForm.name || !editForm.email) return;
        setAdmins((prev) => prev.map((a) => a.id === editingId ? { ...editForm } : a));
        cancelEdit();
    };

    const statusColor = (s) => s === "Ativo" ? "bg-success" : "bg-danger";

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Administradores</h5>
                <button className="btn btn-sm btn-dark" onClick={() => { setShowForm(!showForm); cancelEdit(); }}>
                    {showForm ? "Cancelar" : "+ Novo Admin"}
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
                    {admins.map((a, index) => (
                        <tr key={a.id || index}>
                            <td className="fw-semibold">{a.name}</td>
                            <td>{a.email}</td>
                            <td>{a.phone}</td>
                            <td><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></td>
                            <td>
                                <div className="d-flex gap-1">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(a)}>Editar</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => setAdmins(admins.filter((x) => x.id !== a.id))}>Remover</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ─────────────────── TABELA GESTORES ─────────────────── */
function ManagersTable({ managers, setManagers }) {
    const emptyForm = { name: "", email: "", phone: "", password: "", status: "Ativo" };
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    };

    const handleCreate = () => {
        if (!form.name || !form.email) return;
        setManagers((prev) => [...prev, { id: Date.now(), ...form }]);
        setForm(emptyForm);
        setShowForm(false);
    };

    const startEdit = (m) => { setEditingId(m.id); setEditForm({ ...m }); setShowForm(false); };
    const cancelEdit = () => { setEditingId(null); setEditForm(null); };
    const saveEdit = () => {
        if (!editForm.name || !editForm.email) return;
        setManagers((prev) => prev.map((m) => m.id === editingId ? { ...editForm } : m));
        cancelEdit();
    };

    const statusColor = (s) => s === "Ativo" ? "bg-success" : "bg-danger";

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Gestores</h5>
                <button className="btn btn-sm btn-dark" onClick={() => { setShowForm(!showForm); cancelEdit(); }}>
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
                    {managers.map((m, index) => (
                        <tr key={m.id || index}>
                            <td className="fw-semibold">{m.name}</td>
                            <td>{m.email}</td>
                            <td>{m.phone}</td>
                            <td><span className={`badge ${statusColor(m.status)}`}>{m.status}</span></td>
                            <td>
                                <div className="d-flex gap-1">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(m)}>Editar</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => setManagers(managers.filter((x) => x.id !== m.id))}>Remover</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ── Formulário reutilizável de pessoa ── */
function PersonForm({ form, setForm, title, submitLabel, generatePassword, onSubmit }) {
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
                <div className="col-md-4">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Estado</label>
                    <select className="form-select form-select-sm"
                        value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option>Ativo</option>
                        <option>Inativo</option>
                    </select>
                </div>
            </div>
            <button className="btn btn-sm btn-success mt-3" onClick={onSubmit}>{submitLabel}</button>
        </div>
    );
}

/* ───────────────────────── TICKETS / REQUESTS / DOCS / SETTINGS ───────────────────────── */
function Tickets() { return <div className="card p-3"><h5>Tickets</h5></div>; }
function Requests() { return <div className="card p-3"><h5>Pedidos</h5></div>; }
function Docs() { return <div className="card p-3"><h5>Documentos</h5></div>; }
function Settings() { return <div className="card p-3"><h5>Configurações</h5></div>; }
function Card({ title, value, color }) {
    return (
        <div className="col-md-3">
            <div className={`card text-bg-${color} p-3`}>
                <h6>{title}</h6><h3>{value}</h3>
            </div>
        </div>
    );
}

/* ───────────────────────── CONTENT ───────────────────────── */
function Content() {
    const [pages, setPages] = useState([
        { id: 1, page: "Início", section: "Hero", content: "Segurança cibernética para empresas modernas.", updated: "10/05/2026" },
    ]);
    const [editing, setEditing] = useState(null);
    const [text, setText] = useState("");

    return (
        <div className="card p-3">
            <h5>Gestão de Conteúdo</h5>
            <p>A carregar secções da página pública...</p>
        </div>
    );
}