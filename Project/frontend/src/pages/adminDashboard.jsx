import { useState, useEffect } from "react";
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
    const [admins, setAdmins] = useState([]);
    const [managers, setManagers] = useState([
        { id: 1, name: "Rui Gestor", email: "rui@cyberbox.pt", phone: "+351 910 000 020", password: "Yz7$nQ5!wR3&", status: "Ativo" },
    ]);

    const reloadAdmins = async () => {
        try {
            const res = await axios.get("https://orion-dewp.onrender.com/api/users");
            const data = await res.json();
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
            const data = await res.json();
            const mapped = data.users
                .filter(u => u.id_tipo === 2)
                .map(u => ({
                    ...u,
                    id: u.id_Utilizador,
                    phone: u.telephone,              // ✅ mapear campo
                    status: u.active ? "Ativo" : "Inativo"  // ✅ mapear estado
                }));
            setManagers(mapped);
        } catch (err) {
            console.error("Error loading managers:", err);
        }
    };

    const reloadCompanies = async () => {
        try {
            const res = await axios.get("https://orion-dewp.onrender.com/api/companies");
            const data = await res.json();
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
                // clientes são os users associados à empresa com id_tipo === 3
                clients: (c.users || []).filter(u => u.id_tipo === 3).map(u => ({
                    name: u.name,
                    email: u.email,
                    phone: u.telephone
                }))
            }));
            setAccounts(mapped);
        } catch (err) {
            console.error("Error loading companies:", err);
        }
    };

    useEffect(() => {
        reloadAdmins();
        reloadManagers();
        reloadCompanies(); // vai falhar até o endpoint existir
    }, []);


    return (
        <div className="d-flex flex-column gap-4">
            <CompaniesTable accounts={accounts} setAccounts={setAccounts} reloadCompanies={reloadCompanies} />
            <AdminsTable admins={admins} setAdmins={setAdmins} reloadAdmins={reloadAdmins} />
            <ManagersTable managers={managers} setManagers={setManagers} reloadManagers={reloadManagers} />
        </div>
    );
}

function CompaniesTable({ accounts, setAccounts, reloadCompanies }) {
    const getEmptyForm = () => ({
        company: "", status: "Ativo",
        clients: [{ name: "", email: "", phone: "" }],
        securityManager: { name: "", email: "", phone: "" },
        permanentContact: { name: "", email: "", phone: "" },
    });

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(getEmptyForm());
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const setField = (f, v) => setForm((p) => ({ ...p, [f]: v }));
    const setSubField = (s, f, v) => setForm((p) => ({ ...p, [s]: { ...p[s], [f]: v } }));
    const setClient = (i, f, v) => setForm((p) => { const c = [...p.clients]; c[i] = { ...c[i], [f]: v }; return { ...p, clients: c }; });
    const addClient = () => setForm((p) => ({ ...p, clients: [...p.clients, { name: "", email: "", phone: "" }] }));
    const removeClient = (i) => setForm((p) => ({ ...p, clients: p.clients.filter((_, idx) => idx !== i) }));

    const setEField = (f, v) => setEditForm((p) => ({ ...p, [f]: v }));
    const setESubField = (s, f, v) => setEditForm((p) => ({ ...p, [s]: { ...p[s], [f]: v } }));
    const setEClient = (i, f, v) => setEditForm((p) => { const c = [...p.clients]; c[i] = { ...c[i], [f]: v }; return { ...p, clients: c }; });
    const addEClient = () => setEditForm((p) => ({ ...p, clients: [...p.clients, { name: "", email: "", phone: "" }] }));
    const removeEClient = (i) => setEditForm((p) => ({ ...p, clients: p.clients.filter((_, idx) => idx !== i) }));

    const handleCreate = async () => {
        if (!form.company) return;
        try {
            const res = await axios.post("https://orion-dewp.onrender.com/api/companies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: form.company,
                    status: form.status === "Ativo",
                    nomeResponsavelSeg: form.securityManager.name,
                    emailResponsavelSeg: form.securityManager.email,
                    telefoneResponsavelSeg: form.securityManager.phone,
                    nomeContactoPerm: form.permanentContact.name,
                    emailContactoPerm: form.permanentContact.email,
                    telefoneContactoPerm: form.permanentContact.phone
                })
            });
            const data = await res.json();
            if (data.success) {
                await reloadCompanies();
                setForm(getEmptyForm());
                setShowForm(false);
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const startEdit = (a) => {
        setEditingId(a.id);
        setEditForm({ ...a, clients: a.clients.map(c => ({ ...c })) });
        setShowForm(false);
    };

    const cancelEdit = () => { setEditingId(null); setEditForm(null); };

    const saveEdit = async () => {
        if (!editForm.company) return;
        try {
            // TODO: confirm endpoint URL and request body structure with backend team
            const res = await axios.put(`https://orion-dewp.onrender.com/api/companies/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: editForm.company,
                    status: editForm.status === "Ativo",
                    nomeResponsavelSeg: editForm.securityManager.name,
                    emailResponsavelSeg: editForm.securityManager.email,
                    telefoneResponsavelSeg: editForm.securityManager.phone,
                    nomeContactoPerm: editForm.permanentContact.name,
                    emailContactoPerm: editForm.permanentContact.email,
                    telefoneContactoPerm: editForm.permanentContact.phone
                })
            });
            const data = await res.json();
            if (data.success) {
                await reloadCompanies();
                cancelEdit();
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            // TODO: confirm endpoint URL with backend team
            const res = await axios.delete(`https://orion-dewp.onrender.com/api/companies/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                await reloadCompanies();
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const statusColor = (s) => s === "Ativo" ? "bg-success" : s === "Pendente" ? "bg-warning text-dark" : "bg-danger";

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Empresas</h5>
                <button type="button" className="btn btn-sm btn-dark"
                    onClick={() => { setShowForm(!showForm); cancelEdit(); setForm(getEmptyForm()); }}>
                    {showForm ? "Cancelar" : "+ Nova Empresa"}
                </button>
            </div>
            {showForm && (
                <CompanyForm form={form} title="Nova Empresa" submitLabel="Criar Empresa"
                    setField={setField} setSubField={setSubField}
                    setClient={setClient} addClient={addClient} removeClient={removeClient}
                    onSubmit={handleCreate} />
            )}
            <table className="table table-hover mb-0">
                <thead className="table-dark">
                    <tr><th>Empresa</th><th>Clientes</th><th>Resp. Segurança</th><th>Contacto Perm.</th><th>Estado</th><th>Ações</th></tr>
                </thead>
                <tbody>
                    {accounts.map((a) => (
                        <>
                            <tr key={a.id}>
                                <td className="fw-semibold">{a.company}</td>
                                <td>{a.clients.length} cliente(s)</td>
                                <td>{a.securityManager.name}</td>
                                <td>{a.permanentContact.name}</td>
                                <td><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></td>
                                <td>
                                    <div className="d-flex gap-1">
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(a)}>Editar</button>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id)}>Remover</button>
                                    </div>
                                </td>
                            </tr>
                            {editingId === a.id && editForm && (
                                <tr key={`edit-${a.id}`}>
                                    <td colSpan={6} className="p-0">
                                        <div className="border border-warning rounded m-2 p-3 bg-white">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0">Editar — {a.company}</h6>
                                                <button type="button" className="btn btn-sm btn-link text-secondary p-0" onClick={cancelEdit}>✕ Cancelar</button>
                                            </div>
                                            <CompanyForm form={editForm} title="" submitLabel="Guardar Alterações"
                                                setField={setEField} setSubField={setESubField}
                                                setClient={setEClient} addClient={addEClient} removeClient={removeEClient}
                                                onSubmit={saveEdit} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                    {accounts.length === 0 && (
                        <tr><td colSpan={6} className="text-center text-muted py-3">Nenhuma empresa criada.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

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
                    <select className="form-select form-select-sm" value={form.status} onChange={(e) => setField("status", e.target.value)}>
                        <option>Ativo</option>
                        <option>Inativo</option>
                    </select>
                </div>
            </div>
            <hr />
            <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="fw-semibold" style={{ fontSize: 13 }}>Clientes</label>
                    <button type="button" className="btn btn-sm btn-outline-dark" onClick={addClient}>+ Adicionar Cliente</button>
                </div>
                {form.clients.map((client, i) => (
                    <div className="row g-2 mb-2 align-items-end" key={i}>
                        <div className="col-md-3">
                            <label className="form-label" style={{ fontSize: 11 }}>Nome</label>
                            <input className="form-control form-control-sm" placeholder="Nome"
                                value={client.name} onChange={(e) => setClient(i, "name", e.target.value)} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" style={{ fontSize: 11 }}>Email</label>
                            <input className="form-control form-control-sm" placeholder="email@empresa.com"
                                value={client.email} onChange={(e) => setClient(i, "email", e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label" style={{ fontSize: 11 }}>Telefone</label>
                            <input className="form-control form-control-sm" placeholder="+351 910 000 000"
                                value={client.phone} onChange={(e) => setClient(i, "phone", e.target.value)} />
                        </div>
                        <div className="col-md-2">
                            {form.clients.length > 1 && (
                                <button type="button" className="btn btn-sm btn-outline-danger w-100"
                                    onClick={() => removeClient(i)}>Remover</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <hr />
            <div className="mb-3">
                <label className="fw-semibold d-block mb-2" style={{ fontSize: 13 }}>Responsável de Segurança</label>
                <div className="row g-2">
                    {["name", "email", "phone"].map((f) => (
                        <div className="col-md-4" key={f}>
                            <label className="form-label" style={{ fontSize: 11 }}>{f === "name" ? "Nome" : f === "email" ? "Email" : "Telefone"}</label>
                            <input className="form-control form-control-sm"
                                placeholder={f === "name" ? "Nome" : f === "email" ? "email@empresa.com" : "+351 910 000 000"}
                                value={form.securityManager[f]} onChange={(e) => setSubField("securityManager", f, e.target.value)} />
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
                            <label className="form-label" style={{ fontSize: 11 }}>{f === "name" ? "Nome" : f === "email" ? "Email" : "Telefone"}</label>
                            <input className="form-control form-control-sm"
                                placeholder={f === "name" ? "Nome" : f === "email" ? "email@empresa.com" : "+351 910 000 000"}
                                value={form.permanentContact[f]} onChange={(e) => setSubField("permanentContact", f, e.target.value)} />
                        </div>
                    ))}
                </div>
            </div>
            <button type="button" className="btn btn-sm btn-success" onClick={onSubmit}>{submitLabel}</button>
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
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    telephone: form.phone,
                    id_tipo: 1
                })
            });

            const data = await res.json();

            if (data.success) {
                await reloadAdmins();
                setForm(getEmptyForm());
                setShowForm(false);
            } else {
                alert("Error: " + data.message);
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
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editForm.name,
                    email: editForm.email,
                    telephone: editForm.phone,
                    password: editForm.password
                })
            });
            const data = await res.json();
            if (data.success) {
                await reloadAdmins();
                cancelEdit();
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`https://orion-dewp.onrender.com/api/users/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                await reloadAdmins();
            } else {
                alert("Error: " + data.message);
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
                        <>
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
                            {editingId === a.id && editForm && (
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
                        </>
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
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password, telephone: form.phone, id_tipo: 2 })
            });
            const data = await res.json();
            if (data.success) {
                await reloadManagers();
                setForm(getEmptyForm());
                setShowForm(false);
            } else {
                alert("Error: " + data.message);
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
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editForm.name,
                    email: editForm.email,
                    telephone: editForm.phone,
                    password: editForm.password
                })
            });
            const data = await res.json();
            if (data.success) {
                await reloadManagers();
                cancelEdit();
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`https://orion-dewp.onrender.com/api/users/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                await reloadManagers();
            } else {
                alert("Error: " + data.message);
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
                        <>
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
                            {editingId === m.id && editForm && (
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
                        </>
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
    return (
        <div className="card p-3">
            <h5>Tickets</h5>
            <ul className="list-group mt-3">
                <li className="list-group-item">#T001 - VPN falhou</li>
                <li className="list-group-item">#T002 - Relatório em falta</li>
            </ul>
        </div>
    );
}

function Requests() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("Todos");

    const reloadRequests = async () => {
        try {
            const res = await fetch("https://orion-dewp.onrender.com/api/requests");
            const data = await res.json();
            setRequests(data.requests || data);
        } catch (err) {
            console.error("Error loading requests:", err);

            // Fallback mock data matching your image screenshot layout perfectly
            setRequests([
                {
                    id: 1,
                    title: "Auditoria de Segurança Completa",
                    description: "Pedido de auditoria completa aos sistemas de segurança da organização",
                    company: "TechCorp",
                    date: "03/06/2026",
                    itemsCount: 2,
                    type: "Auditoria",
                    assignedTo: "Admin Principal",
                    status: "Em Execução"
                }
            ]);
        }
    };

    useEffect(() => {
        reloadRequests();
    }, []);

    const totalRequests = requests.length;
    const countByStatus = (status) => requests.filter(r => r.status === status).length;

    const filteredRequests = filter === "Todos"
        ? requests
        : requests.filter(r => r.status === filter);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Pendente": return "bg-warning text-dark";
            case "Aprovados": return "bg-success";
            case "Em Execução": return "bg-warning text-dark";
            case "Concluídos": return "bg-secondary";
            default: return "bg-primary";
        }
    };

    return (
        <div className="d-flex flex-column gap-4 text-dark text-start">
            <div>
                <h3 className="fw-bold mb-1">Gestão de Pedidos</h3>
                <p className="text-muted small">Gerir pedidos dos clientes</p>
            </div>

            {/* --- 1. Summary Status Cards --- */}
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
                            <div className="text-muted small">Pendentes</div>
                            <h4 className="fw-bold text-primary m-0">{countByStatus("Pendente")}</h4>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
                        <div>
                            <div className="text-muted small">Aprovados</div>
                            <h4 className="fw-bold text-success m-0">{countByStatus("Aprovados")}</h4>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
                        <div>
                            <div className="text-muted small">Em Execução</div>
                            <h4 className="fw-bold text-warning m-0">{countByStatus("Em Execução")}</h4>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
                        <div>
                            <div className="text-muted small">Concluídos</div>
                            <h4 className="fw-bold text-secondary m-0">{countByStatus("Concluídos")}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. Filter Tab Menu --- */}
            <div className="card p-3 shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-2 text-muted small fw-semibold">
                    <span>Filtros</span>
                </div>
                <div className="d-flex gap-2">
                    {["Todos", "Pendente", "Aprovados", "Em Execução", "Concluídos"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`btn btn-sm px-3 ${filter === status ? "btn-primary" : "btn-light border text-secondary"}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- 3. Request Row Items View --- */}
            <div className="d-flex flex-column gap-2">
                {filteredRequests.map((request) => (
                    <div key={request.id} className="card p-3 shadow-sm bg-white d-flex flex-row justify-content-between align-items-center border-start border-4 border-info">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <h6 className="fw-bold m-0">{request.title}</h6>
                                <span className={`badge ${getStatusBadgeClass(request.status)}`} style={{ fontSize: "10px" }}>
                                    {request.status}
                                </span>
                            </div>
                            <p className="text-muted small m-0 mb-2">{request.description}</p>
                            <div className="d-flex align-items-center gap-3 text-secondary" style={{ fontSize: "12px" }}>
                                <span>👤 {request.company}</span>
                                <span>📅 {request.date}</span>
                                <span>📋 {request.itemsCount} itens</span>
                                <span>🛠️ {request.type}</span>
                                <span className="text-primary fw-medium">Atribuído: {request.assignedTo}</span>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-sm btn-link text-primary fs-5 p-0">
                                👁️
                            </button>
                        </div>
                    </div>
                ))}

                {filteredRequests.length === 0 && (
                    <div className="text-center text-muted p-4 bg-white border rounded">
                        Nenhum pedido encontrado com o estado atual selecionado.
                    </div>
                )}
            </div>
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

function Content() {
    const [pages, setPages] = useState([
        { id: 1, page: "Início", section: "Hero", content: "Segurança cibernética para empresas modernas.", updated: "10/05/2026" },
        { id: 2, page: "Home", section: "Sobre nós", content: "A CyberBox protege empresas desde 2018...", updated: "08/05/2026" },
        { id: 3, page: "Serviços", section: "Intro", content: "Oferecemos soluções completas de cibersegurança.", updated: "02/05/2026" },
        { id: 4, page: "NIS2", section: "Descrição", content: "A diretiva NIS2 entra em vigor em 2024...", updated: "28/04/2026" },
        { id: 5, page: "Contacto", section: "Texto", content: "Entre em contacto connosco para mais informações.", updated: "20/04/2026" },
    ]);
    const [editing, setEditing] = useState(null);
    const [text, setText] = useState("");

    // TODO: replace useState initial data with API call when endpoint is ready
    // const reloadContent = async () => {
    //     const res = await fetch("https://orion-dewp.onrender.com/api/content");
    //     const data = await res.json();
    //     setPages(data.content);
    // };
    // useEffect(() => { reloadContent(); }, []);

    const handleEdit = (item) => { setEditing(item.id); setText(item.content); };

    const handleSave = async (id) => {
        // TODO: uncomment when endpoint is ready
        // try {
        //     const res = await fetch(`https://orion-dewp.onrender.com/api/content/${id}`, {
        //         method: "PUT",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ content: text })
        //     });
        //     const data = await res.json();
        //     if (!data.success) { alert("Error: " + data.message); return; }
        //     await reloadContent();
        // } catch (err) {
        //     alert("Connection error: " + err.message);
        // }

        // TODO: remove this local update once API is connected
        setPages(pages.map(p => p.id === id ? { ...p, content: text, updated: new Date().toLocaleDateString("pt-PT") } : p));
        setEditing(null);
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
                </tbody>
            </table>
        </div>
    );
}