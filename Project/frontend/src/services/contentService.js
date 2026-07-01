import axios from "axios";

const API = "https://orion-dewp.onrender.com/api";

let cache = [];

export async function loadContent() {
    try {
        const res = await axios.get(`${API}/content`);
        cache = res.data;
    } catch (err) {
        console.error("Erro ao carregar conteúdo:", err);
    }
}

export function getContent(page, section, fallback = "") {
    const item = cache.find(c => c.page === page && c.section === section);
    return item?.content || fallback;
}