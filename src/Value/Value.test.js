//@flow

const counter8 = new Value(44);

const counter9 = counter8.asComputed().map(value => value + 1);

const counter10 = counter9.map(value => `dsadsa ${value}`);

const connection = counter10.connect(() => {
    console.info('TRZEBA ODŚWIEŻYĆ WIDOK');
});

console.info('value ==>', connection.getValue());

counter8.setValue(334444);

console.info('value ==>', connection.getValue());

counter8.setValue(6);


console.info('value ==>', connection.getValue());

