import { HashRouter, Switch } from 'react-router-dom';
import React from 'react';
import history from '../helpers/history';
import Route from "./Route";
import Login from '../components/Auth/Login';
import Forgotpassword from '../components/Auth/Forgotpassword';
import Home from '../components/Home/Home' 
import ApplicationPanel from '../components/Home/ApplicationPanel';
import Recent from '../components/Home/RecentResults' 
import SearchResult from '../components/SearchedResults/SearchedResults';
import IpSequenceSearch from '../components/IpSequenceSearch/IpSequenceSearch';

class Routes extends React.Component {
    render() {
        console.log('qwdhijoiefhdoihdf')
        return (
            <HashRouter history={history}>
                <Switch>
                    <Route exact path="/" title="login" component={Login} />
                    <Route exact path="/login" title="login" component={Login} />
                    <Route exact path="/forgot" title="forgot" component={Forgotpassword} />
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/search" component={SearchResult} />
                    <Route exact path="/recent" component={Recent} />
                    <Route exact path="/applicationPanel" component={ApplicationPanel} />
                    <Route exact path="/ipseqsearch" title="ipSequenceSearch" component={IpSequenceSearch} />
                </Switch>
            </HashRouter>)
    }
}

export default Routes
