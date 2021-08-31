import { HashRouter, Switch } from 'react-router-dom';
import React from 'react';
import { Router, Redirect } from "react-router-dom";
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
import MergeResults from '../components/MergeResults/MergeResults';
import SearchResultSequence from '../components/SearchResultSequence/SearchResultSequence';
import IpSequenceVariation from '../components/IpSequenceVariation/IpSequenceVariation';
import SearchResultAntibody from '../components/SearchResultAntibody/SearchResultAntibody'
import ResultReportFolder from '../components/ResultReportFolder/ResultReportFolder';
import FullTextSearch from '../components/FullTextSearch/FullTextSearch';
import NewPassword from '../components/Auth/NewPassword';
import ConvertSequence from '../components/ConvertSequence/ConvertSequence';
import ParsedXml from '../components/ConvertSequence/ParsedXml';
import PersonalDatabase from '../components/PersonalDatabase/PersonalDatabase';

// import {isAdminLogin} from './helpers/authorizedInfo'
// const AuthRoute = ({ component: Component, ...rest }) => {
//     return (
//       <Route {...rest} render={props => (
//         isAdminLogin() ?
//           <Component {...props} />: <Redirect to={{ pathname: '/admin/login' }} />
//       )} />
//     );
//   };


class Routes extends React.Component {


    render() {
        const isUserLogin = localStorage.getItem('isLoggedIn') ? localStorage.getItem('isLoggedIn') : false;
        // const isUserLogin = localStorage.getItem('isLoggedIn');

        // const data = getItem()
        return (
            <HashRouter history={history}>
                <Switch>
                    <Route exact path="/" title="login" component={Login} />
                    <Route exact path="/login" title="login" component={Login} />
                    <Route exact path="/forgot" title="forgot" component={Forgotpassword} />
                    <Route exact path="/newpassword" component={NewPassword} />
                    <Route exact path="/reset_password&key=:key&userId:userId" component={NewPassword} />

                    {/* {isUserLogin ?  */}
                    <React.Fragment>
                        <Route exact path="/home" title="" component={Home} />
                        <Route exact path="/changePassword" title="changePassMange" component={ChangePassword} />
                        <Route exact path="/search" title="savedSearchForms" component={SearchResult} />
                        <Route exact path="/recent" component={Recent} />
                        <Route exact path="/applicationPanel" component={ApplicationPanel} />
                        <Route exact path="/ipseqsearch" title="ipseqsearch" component={IpSequenceSearch} />
                        <Route exact path="/ipseqsearch/:parentId" title="ipseqsearch" component={IpSequenceSearch} />
                        <Route exact path="/ipseqsearch/template/:tempname" title="ipseqsearch" component={IpSequenceSearch} />
                        <Route exact path="/searchresseq" title="searchresseq" component={SearchResultSequence} />
                        <Route exact path="/searchresseq/:workflowId" title="searchresseq" component={SearchResultSequence} />
                        <Route exact path="/searchresantibody" title="searchresantibody" component={SearchResultAntibody} />
                        <Route exact path="/searchresantibody/:workflowId" title="searchresantibody" component={SearchResultAntibody} />
                        <Route exact path="/searchresantibody/template/:tempname" title="searchresantibody" component={SearchResultAntibody} />
                        <Route exact path="/searchResult" title="manageSearchRes" component={SearchManagement} />
                        <Route exact path="/accountinfo" title="accountInfoMange" component={AccountInfo} />
                        <Route exact path="/merge" component={MergeResults} />
                        <Route exact path="/ipseqvariation" title="ipseqvariation" component={IpSequenceVariation} />
                        <Route exact path="/ipseqvariation/:parentId" title="ipseqvariation" component={IpSequenceVariation} />
                        <Route exact path="/ipseqvariation/template/:tempname" title="ipseqvariation" component={IpSequenceVariation} />
                        <Route exact path="/report/folder/:folderId" title='foldermoduletitle' component={ResultReportFolder} />
                        <Route exact path="/fulltextsearch" title="fulltextsearch" component={FullTextSearch} />
                        <Route exact path="/convertsequence" title="Sequence format Conversion" component={ConvertSequence} />
                        <Route exact path="/parsedxml" title="Sequence format Conversion" component={ParsedXml} />
                        <Route exact path="/personaldb" title="Personal Databases" component={PersonalDatabase} />

                    </React.Fragment>
                    {/* :  */}
                    <Redirect to='/login' />
                    {/* } */}


                </Switch>
            </HashRouter>)
    }
}

export default Routes

