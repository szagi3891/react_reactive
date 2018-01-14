//@flow

import { ValueSubscription } from './ValueSubscription';
import { ValueConnection } from './ValueConnection';

/*
    Trzeba dodać memoryzowanie ostatniej wartości

    jakąś lokalną zmienną sobie trzeba przygotować na wartości wejściowe i wartość wyjściową
    w momencie gdy trzeba będzie wyliczyć jeszcze raz kesz, sprawdzamy czy przypadkiem nie mamy wyliczonej tej wartości

    gdy liczba subskryberów spadnie do zera to trzeba skasować memoryzację


    komponent będzie posiadał memoryzację na poziomie PureComponrntu.
    czyli jak się nie zmieniły propsy, to nic nie przerenderuje


    refresh komponentu powinien być wywoływany jeśli wystąpiła jakaś zmiana na którymś z propsów z których powstał ostatni widok


    getValue może zwracać --->

    {
        kolejna_wersja_wyniku: number,
        value: T
    }

    wtedy będzie można określić czy dla tej wartości przeprowadzana była już operacja


    mając takie dane, będzie można określić w kommponencie reaktowym czy konieczne jest przeliczenie komponentu ...
*/

export class ValueComputed<T> {
    _subscription: ValueSubscription;

    _getParentConnection: (param: () => Set<() => void>) => ValueConnection<T>;
    _connection: null | ValueConnection<T>;

    constructor(getParentConnection: (param: () => Set<() => void>) => ValueConnection<T>) {
        this._getParentConnection = getParentConnection;
        this._connection = null;

        this._subscription = new ValueSubscription(() => {
            if (this._connection !== null) {
                this._connection.disconnect();
                this._connection = null;
            } else {
                throw Error('ValueComputed - rozłączanie - Nieprawidłowe oggałęzienie');
            }
        });
    }

    _getParentValueConnection(): ValueConnection<T> {
        if (this._connection) {
            return this._connection;
        }

        const valueConnection = this._getParentConnection(() => {
            return this._subscription.notify();
        });

        this._connection = valueConnection;
        return valueConnection;
    }

    _getValue(): T {
        return this._getParentValueConnection().getValue();
    }

    map<M>(mapFun: (value: T) => M): ValueComputed<M> {
        return new ValueComputed(
            (notify: (() => Set<() => void>)): ValueConnection<M> => {
                const disconnect = this._subscription.bind(notify);
                return new ValueConnection(
                    () => mapFun(this._getValue()),
                    disconnect
                );
            }
        );
    }

    connect(onRefresh: (() => void) | null): ValueConnection<T> {
        const disconnect = this._subscription.bind(
            () => new Set(onRefresh === null ? [] : [onRefresh])
        );

        return new ValueConnection(
            () => this._getValue(),
            disconnect
        );
    }
}

