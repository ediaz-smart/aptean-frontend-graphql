import React from 'react';
import Header from '../../shared/header';
import Footer from '../../shared/footer';
import ApplicationPanel from '../Home/ApplicationPanel';
import MostUsedPanel from '../Home/MostUsedPanel';
import RecentResults from '../Home/RecentResults';

import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    mainContent: {
        margin: '3px 30px'
    }
}));

function HomeLayout() {
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

export default HomeLayout;