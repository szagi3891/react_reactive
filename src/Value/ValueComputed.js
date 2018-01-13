//@flow

import { ValueSubscription } from './ValueSubscription';
import type { AddParamType } from './ValueSubscription';
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

    _getParentConnection: (param: AddParamType) => ValueConnection<T>;
    _connection: null | ValueConnection<T>;

    constructor(getParentConnection: (param: AddParamType) => ValueConnection<T>) {
        this._getParentConnection = getParentConnection;
        this._connection = null;

        this._subscription = new ValueSubscription((subscribersCount: number) => {
            if (subscribersCount === 0 && this._connection !== null) {
                this._connection.disconnect();
                this._connection = null;
            }
        });
    }

    _getParentValueConnection(): ValueConnection<T> {
        if (this._connection) {
            return this._connection;
        }

        const valueConnection = this._getParentConnection({
            notify: () => {
                return this._subscription.notify();
            },
            onRefresh: null
        });

        this._connection = valueConnection;
        return valueConnection;
    }

    _getValue(): T {
        return this._getParentValueConnection().getValue();
    }

    map<M>(mapFun: (value: T) => M): ValueComputed<M> {
       return new ValueComputed(
            this._subscription.buildCreatorForConnection(
                () => mapFun(this._getValue())
            )
        );
    }

    connect(onRefresh: (() => void) | null): ValueConnection<T> {
        return this._subscription.bind(
            () => this._getValue(),
            onRefresh
        );
    }
}

