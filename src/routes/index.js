import { Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import history from '../helpers/history';
import Login from '../components/Login';

class Routes extends React.Component {
    render() {
        console.log('qwdhijoiefhdoihdf')
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/login" component={Login} />
                </Switch>
            </Router>)
    }
}

export default Routes
