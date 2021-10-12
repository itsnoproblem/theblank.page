import BPage, {blankPage} from "./Page";

const getAll = (account): Map<number, BPage> => {
    let all = pagesById(account);
    // @ts-ignore
    const sorted = new Map([...Array.from(all.entries())].sort(([x, a], [y, b]) => new Date(b.modified) - new Date(a.modified)))
    return sorted;
};

export const get = (account, id: number): BPage|undefined => {
    let allPages = pagesById(account);
    return allPages.get(id);
};

export const create = (account, pg: BPage): number => {
    pg.id = nextId(account);
    let allPages = pagesById(account);
    allPages.set(pg.id, pg);
    save(account, allPages);
    return pg.id;
};

export const update = (account, pg: BPage): boolean => {
    let allPages = pagesById(account);
    if(!allPages.has(pg.id)) {
        console.error("Page not found for update "+pg.id);
        return false;
    }

    pg.modified = new Date();
    allPages.set(pg.id, pg);
    return save(account, allPages);
};

export const remove = (account, id: number): boolean => {
    let allPages = pagesById(account);
    allPages.delete(id);
    return save(account, allPages);
}

const StorageKey = (account): string => {
    if(account === undefined || account === null) {
        account = "0x0"
    }
    return "pagesById-v1.0.0-" + account;
}

const save = (account, pages: Map<number, BPage>): boolean => {
    const raw = JSON.stringify(Array.from(pages.entries()));
    localStorage.setItem(StorageKey(account), raw);
    return true;
}

const pagesById = (account): Map<number, BPage> => {
    let allPages;
    let raw = localStorage.getItem(StorageKey(account));
    if(raw) {
        allPages = JSON.parse(raw);

    }
    else {
        allPages = [];
    }

    return new Map<number, BPage>(allPages);
}

const latest = (account): BPage => {
    const all = getAll(account);
    if(all.size < 1) {
        let pg = blankPage(account);
        pg.id = create(account, pg);
        return pg;
    }

    return all.entries().next().value[1];
}

const nextId = (account) => {
    if(account === undefined || account === null) {
        account = "0x0"
    }
    const key = StorageKey(account) + "maxId";
    let currentId = localStorage.getItem(key) || "0";
    let max = parseInt(currentId) + 1;
    localStorage.setItem(key, max.toString());
    return max;
}

const BPageService = {
    getAll: getAll,
    get: get,
    create: create,
    update: update,
    latest: latest,
    remove: remove,
};

export default BPageService;