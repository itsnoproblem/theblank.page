import BPage  from "./Page";

const getAll = (): Map<number, BPage> => {
    return pagesById();
};

export const get = (id: number): BPage|undefined => {
    let allPages = pagesById();
    return allPages.get(id);
};

export const create = (pg: BPage): number => {
    pg.id = nextId();
    let allPages = pagesById()
    allPages.set(pg.id, pg);
    save(allPages);
    return pg.id;
};

export const update = (pg: BPage): boolean => {
    let allPages = pagesById();
    if(!allPages.has(pg.id)) {
        console.error("Page not found for update "+pg.id);
        return false;
    }

    allPages.set(pg.id, pg);
    return save(allPages);
};

const save = (pages: Map<number, BPage>): boolean => {
    const raw = JSON.stringify(Array.from(pages.entries()));
    localStorage.setItem("pagesById", raw);
    return true;
}

const pagesById = (): Map<number, BPage> => {
    let allPages;
    let raw = localStorage.getItem("pagesById")
    if(raw) {
        allPages = JSON.parse(raw);
    }
    else {
        allPages = []
    }

    return new Map<number, BPage>(allPages);
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