import BPage  from "./Page";

const getAll = (): Map<number, BPage> => {
    return pagesById();
};

const get = (id: number): BPage|undefined => {
    let allPages = pagesById();
    return allPages.get(id);
};

const create = (pg: BPage): number => {
    pg.id = nextId();
    let allPages = pagesById()
    allPages.set(pg.id, pg);
    save(allPages);
    return pg.id;
};

const update = (pg: BPage): boolean => {
    let allPages = pagesById();
    if(allPages.has(pg.id)) {
        console.error("Page not found for update "+pg.id);
        return false;
    }

    allPages.set(pg.id, pg);
    return save(allPages);
};

const save = (pages: Map<number, BPage>): boolean => {
    const raw = JSON.stringify(pages);
    localStorage.setItem("pagesById", raw);
    return true;
}

const pagesById = (): Map<number, BPage> => {
    let raw = localStorage.getItem("pagesById") || "";
    return JSON.parse(raw) || new Map();
}

const nextId = () => {
    let currentId = localStorage.getItem("maxId") || "0";
    let max = parseInt(currentId) + 1;
    localStorage.setItem("maxId", max.toString());
    return max;
}

const BPageService = {
    getAll,
    get,
    create,
    update,
};

export default BPageService;