import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { makeStyles } from '@material-ui/core/styles';
import ReactHtmlParser from 'react-html-parser';

import ContentModal from './Modal/ContentModal';
import NewsService from '../services/news'


const useStyles = makeStyles((theme) => ({
    newsContent: {
        textAlign: 'justify',
        lineHeight: '22px',
        '& p': {
            fontSize: '14px'
        }
    },
    '@media (min-width: 780px)': {
        newsContent: {
            marginLeft: '1.5rem',
            paddingLeft: '36px',
            borderLeft: '1px solid #d8d4d4',
            height: '315px',
            overflowX: 'scroll'
        },
        forgotNewsContent: {
            height: '380px'
        },
        newsMostUsedContent: {
            marginLeft: '0',
            paddingLeft: '0',
            borderLeft: 'none',
            height: '250px',
            overflowX: 'unset'
        }
    }
}));
function NewsUpdate(props) {
    const classes = useStyles();
    const [newsData, setNewsData] = useState('');
    const { t, i18n } = useTranslation('common');

    // reset login status
    useEffect(async () => {
        const getNewsData = await NewsService.getNewsBullet();
        if (getNewsData && getNewsData != undefined) {
            setNewsData(getNewsData['news']);
        }

        var myElement = document.getElementById("newsUpdateDiv");

        if (myElement) {
            const height = myElement.clientHeight;
            if (height > 195) {
                document.getElementById("newsUpdateDiv").className = props.isMostUsedPanel ? "newsUpdateContent" : "p-3";
            }
        }

    }, []);

    return (
        <div>
            <div className={classes.newsContent + ' ' + (props.isMostUsedPanel ? classes.newsMostUsedContent : '') + (props.isForgotPanel ? classes.forgotNewsContent : '')}>
                <div id="newsUpdateDiv" className="p-3">
                    <h5 className="subHeading" style={{ marginBottom: '6px' }}><b>{t('newsandupdates')}</b></h5>
                    {ReactHtmlParser(newsData)}
                </div>
            </div>
        </div>
    );
}

export default NewsUpdate;