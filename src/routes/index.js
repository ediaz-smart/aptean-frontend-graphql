import { Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import history from '../helpers/history';
import Login from '../components/Login';
import SignUp from '../components/SignUp';

class Routes extends React.Component {
    render() {
        console.log('qwdhijoiefhdoihdf')
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signUp" component={SignUp} />
                </Switch>
            </Router>)
    }
}

export default Routes
