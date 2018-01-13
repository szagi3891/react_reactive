//@flow

export const logError = (...args: any) => {
    console.error.apply(console.error, args);
};

export const logInfo = (...args: any) => {
    console.info.apply(console.info, args);
};

export const logGroup = (name: string, toRun: () => void) => {
    console.groupCollapsed(name);
    toRun();
    console.groupEnd();
};