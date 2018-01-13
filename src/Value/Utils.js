//@flow

export const mergeSet = <T>(...list: Array<Set<T>>): Set<T> => {
    const result = new Set();

    for (const argItem of list) {
        for (const item of argItem) {
            result.add(item);
        }
    }

    return result;
};