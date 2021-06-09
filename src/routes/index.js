import { HashRouter, Switch } from 'react-router-dom';
import React from 'react';
import history from '../helpers/history';
import Route from "./Route";
import Login from '../components/Auth/Login';
import Forgotpassword from '../components/Auth/Forgotpassword';
import Home from '../components/Home/Home' 
import ApplicationPanel from '../components/Home/ApplicationPanel';
import Recent from '../components/Home/RecentResults' 
import SearchResult from '../components/SearchedResults/SearchResults';
import IpSequenceSearch from '../components/IpSequenceSearch/IpSequenceSearch';
import ChangePassword from '../components/Auth/ChangePassword';
import SearchManagement from '../components/SearchManagement/SearchManagement';
import AccountInfo from '../components/AccountInfo/AccountInfo';
import MergeResults from '../components/MergeResults/MergeResults'
import SearchResultSequence from '../components/SearchResultSequence/SearchResultSequence'
import IpSequenceVariation from '../components/IpSequenceVariation/IpSequenceVariation';
import SearchResultAntibody from '../components/SearchResultAntibody/SearchResultAntibody'
class Routes extends React.Component {
    render() {
        console.log('qwdhijoiefhdoihdf')
        return (
            <HashRouter history={history}>
                <Switch>
                    <Route exact path="/" title="login" component={Login} />
                    <Route exact path="/login" title="login" component={Login} />
                    <Route exact path="/forgot" title="forgot" component={Forgotpassword} />
                    <Route exact path="/home" title="" component={Home} />
                    <Route exact path="/changePassword" component={ChangePassword} />
                    <Route exact path="/search" component={SearchResult} />
                    <Route exact path="/recent" component={Recent} />
                    <Route exact path="/applicationPanel" component={ApplicationPanel} />
                    <Route exact path="/ipseqsearch" title="ipseqsearch" component={IpSequenceSearch} />
                    <Route exact path="/searchresseq" title="searchresseq" component={SearchResultSequence} />
                    <Route exact path="/searchresseq/:workflowId" title="searchresseq" component={SearchResultSequence} />
                    <Route exact path="/searchresantibody" title="searchresantibody" component={SearchResultAntibody} />
                    <Route exact path="/searchresantibody/:workflowId" title="searchresantibody" component={SearchResultAntibody} />
                    <Route exact path="/searchResult" title="searchResMgmnt"  component={SearchManagement} />
                    <Route exact path="/accountinfo" component={AccountInfo} />
                    <Route exact path="/merge" component={MergeResults} />
                    <Route exact path="/ipseqvariation" title="ipseqvariation" component={IpSequenceVariation} />
                </Switch>
            </HashRouter>)
    }
}

export default Routes
