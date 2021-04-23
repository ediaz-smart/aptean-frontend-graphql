import { Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import history from '../helpers/history';
import Login from '../components/Auth/Login';
import Forgotpassword from '../components/Auth/Forgotpassword';
// import Header from '../components/Header';
import Layout from '../layout' 

class Routes extends React.Component {
    render() {
        console.log('qwdhijoiefhdoihdf')
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/forgot" component={Forgotpassword} />
                    <Route exact path="/home" component={Layout} />
                </Switch>
            </Router>)
    }
}

export default Routes
