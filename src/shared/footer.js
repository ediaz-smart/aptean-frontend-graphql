import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Container } from 'react-bootstrap';
import {useTranslation} from "react-i18next";

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
        width: '96% !important'
    }
});

export default function Footer() {
    const classes = useStyles();
    const {t, i18n} = useTranslation('common');
    return (
        <div className={classes.grow}>
            <AppBar position="static" color="primary" className={classes.footerNav}>
                <Container maxWidth="md">
                    <Toolbar>
                        <p className="w-100 text-center appTextColor">{t('copyRightText')}</p>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>

    )
}
