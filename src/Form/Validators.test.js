import { isHex } from './Validators';

describe('aa', () => {

    it('bb', () => {
        expect(isHex('333')).toBe(true);
        expect(isHex('a')).toBe(true);
        expect(isHex('')).toBe(false);
        expect(isHex('1a4f')).toBe(true);
        expect(isHex('1a4fz')).toBe(false);
    });
})