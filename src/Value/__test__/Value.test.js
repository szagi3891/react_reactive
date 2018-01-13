import { Value } from '../Value';

describe('', () => {
    it('Podstawowy test', () => {

        const counter8 = new Value(44);

        const counter9 = counter8.asComputed().map(value => value + 1);
        
        const counter10 = counter9.map(value => `dsadsa ${value}`);
        
        let refreshCount = 0;

        const connection = counter10.connect(() => {
            refreshCount++;
        });
        
        expect(refreshCount).toBe(0);
        expect(connection.getValue()).toBe('dsadsa 45');
        
        counter8.setValue(334444);
        
        expect(refreshCount).toBe(1);
        expect(connection.getValue()).toBe('dsadsa 334445');
        
        counter8.setValue(6);
        
        expect(refreshCount).toBe(2);
        expect(connection.getValue()).toBe('dsadsa 7');
    });
});