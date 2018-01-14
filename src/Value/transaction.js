//@flow

let level = 0;
let refresh = [];

export const transaction = (funcToRun: () => void) => {
    level++;
    funcToRun();
    level--;

    if (level === 0) {
        const toRefresh: Set<() => void> = new Set(refresh);
        refresh = [];

        for (const item of toRefresh.values()) {
            item();
        }
    }
};

export const pushToRefresh = (funcToRefresh: () => void) => {
    if (level > 0) {
        refresh.push(funcToRefresh);
    } else {
        throw Error('Nieprawidłowe odgałęzienie programu');
    }
};
