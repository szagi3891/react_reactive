//@flow

let level = 0;
let refresh = [];

export const transaction = (funcToRun: () => void) => {
    level++;
    funcToRun();
    level--;

    if (level === 0) {
        const toRefresh = refresh;
        refresh = [];

        for (const item of toRefresh) {
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
