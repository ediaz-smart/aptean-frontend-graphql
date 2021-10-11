import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Container } from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import ReactHtmlParser from 'react-html-parser';

import CopyrightService from '../services/copyright';

const useStyles = makeStyles({
    grow: {
        flexGrow: 1,
    },
    footerNav: {
        paddingLeft: '0',
        backgroundColor: '#fff !important',
        boxShadow: 'none !important',
        color: '#0C90C6 !important',
        margin: 'auto',
        width: '96% !important',
        '& p':{
            fontSize:'14px'
        }
    },
    footerMargin: {
        marginTop: '75px'
    }
});

export default function Footer() {
    const classes = useStyles();
    const {t, i18n} = useTranslation('common');
    const [copyRightData,setCopyRightData] = useState();
    // const getYear = new Date().getFullYear();
    useEffect(() => {
		(async () => {
			let result = await CopyrightService.getCopyright();
            // console.log(result,'result');
            if(result)
            {
                setCopyRightData(result.copyright);
            }
            
			
		})();
	}, []);
    return (
        <div className={classes.grow}>
            <AppBar position="static" color="primary" className={classes.footerNav}>
                <Container>
                    <Toolbar>
                        <p className={"w-100 text-center appTextColor " + classes.footerMargin}>{ReactHtmlParser(copyRightData)}</p>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>

    )
}
