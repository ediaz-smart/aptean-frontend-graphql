import React from 'react';
import Header from '../../shared/header';
import Footer from '../../shared/footer';

import { makeStyles } from '@material-ui/core/styles';

import { useParams } from 'react-router-dom';



const useStyles = makeStyles((theme) => ({
    mainContent: {
        margin: '3px 30px',
        minWidth: '1000px',
        overflow: 'auto'
    }
}));

function Layout(props) {
    const classes = useStyles();
    const { patentId } = useParams();
    console.log('patendId', patentId)
    return (

        <div className={classes.mainContent}>
            <Header title={props.title == "Full Document View" ? patentId : props.title}/>
            {props.children}
            {props.title == "Full Document View" ? <div></div> : <Footer />}
        </div>
    );
}

export default Layout;