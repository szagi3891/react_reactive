//@flow

export const isNumber = (text: string): bool => parseInt(text, 10).toString() === text;

export const isGrunwald = (text: string): bool => text === "1410";

const isHexDigit = (digit: string): bool => {
    if (isNumber(digit)) {
        return true;
    }

    const letter = digit.toLowerCase();
    return ["a", "b", "c", "d", "e", "f"].includes(letter);
}

export const isHex = (text: string): bool => {
    if (text.length === 0) {
        return false;
    }

    const maxIndex = text.length - 1;
    
    for (let i = 0; i <= maxIndex; i++) {
        if (isHexDigit(text[i]) === false) {
            return false;
        }
    }

    return true;
}

export default {
    isNumber,
    isGrunwald,
    isHex
};
