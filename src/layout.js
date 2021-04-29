import React from 'react';
import Header from './shared/header';
import Footer from './shared/footer';
import ApplicationPanel from './components/Home/ApplicationPanel';
import MostUsedPanel from './components/Home/MostUsedPanel';
import RecentResults from './components/Home/RecentResults';

import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    mainContent: {
        margin: '3px 30px'
    }
}));

function Layout() {
    const classes = useStyles();
    return (

        <div className={classes.mainContent}>
            <Header />
            <MostUsedPanel />
            <ApplicationPanel />
            <RecentResults />
            <Footer />
        </div>
    );
}

export default Layout;