import BPage, {blankPage} from "./Page";

const getAll = (): Map<number, BPage> => {
    let all = pagesById();
    // @ts-ignore
    const sorted = new Map([...Array.from(all.entries())].sort(([x, a], [y, b]) => new Date(b.modified) - new Date(a.modified)))
    return sorted;
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

    pg.modified = new Date();
    allPages.set(pg.id, pg);
    return save(allPages);
};

export const remove = (id: number): boolean => {
    let allPages = pagesById();
    allPages.delete(id);
    return save(allPages);
}

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

const latest = (): BPage => {
    const all = getAll();
    if(all.size < 1) {
        let pg = blankPage();
        pg.id = create(pg);
        return pg;
    }

    return all.entries().next().value[1];
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
    latest,
    remove,
};

export default BPageService;