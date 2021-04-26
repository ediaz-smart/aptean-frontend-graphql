import React from 'react';
import Header from './shared/header';
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
            
        </div>
    );
}

export default Layout;