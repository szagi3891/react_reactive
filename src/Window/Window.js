//@flow
import * as React from 'react';
import {observable, computed, action} from 'mobx';
import {observer} from 'mobx-react';
//import DevTools from 'mobx-react-devtools'

type PropsType = {|
    className?: string,
|};

@observer
export default class Window extends React.Component<PropsType> {
    render() {
        return (
            <div>...</div>
        );
    }
}
