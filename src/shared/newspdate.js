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
        marginLeft: '1.5rem',
        paddingLeft: '24px',
        borderLeft: '1px solid #d8d4d4',
        height: '315px',
        overflowX: 'scroll',
        '& p': {
            fontSize: '14px'
        }
    },
<<<<<<< Updated upstream:src/shared/newspdate.js
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
            padding: '12px 0',
            height: '210px',
            overflowX: 'unset'
        }
=======
    newsMostUsedContent: {
        marginLeft: '0',
        paddingLeft: '0',
        borderLeft: 'none',
        height: '250px',
        overflowX: 'unset'
    },
    forgotNewsContent: {
        height: '380px',
        overflow: 'auto'
>>>>>>> Stashed changes:src/shared/NewsUpdate.js
    }
}));
function Newsupdate(props) {
    const classes = useStyles();
    const [newsData, setNewsData] = useState('');
    const { t, i18n } = useTranslation('common');
    // const [showMore, setShowMore] = useState(true);
    const [modalShow, setModalShow] = React.useState(false);

    // reset login status
    useEffect(async () => {
        //dispatch(userActions.logout()); 
        const getNewsData = await NewsService.getNewsBullet();
        if (getNewsData && getNewsData != undefined) {
            setNewsData(getNewsData['news']);
        }

        var myElement = document.getElementById("newsUpdateDiv");

        if (myElement) {
            const height = myElement.clientHeight;
            if (height > 195) {
<<<<<<< Updated upstream:src/shared/newspdate.js
                // setShowMore(true);
                document.getElementById("newsUpdateDiv").className = props.isMostUsedPanel ? "newsUpdateContent" : "p-3";
=======
                document.getElementById("newsUpdateDiv").className = props.isForgotPanel ? "p-3" : props.isMostUsedPanel ? "newsUpdateContent" : "p-3";
>>>>>>> Stashed changes:src/shared/NewsUpdate.js
            }
        }

    }, []);
    const elementContent = <div><p className={"subHeading" + ' ' + (props.isMostUsedPanel ? 'ml-2 mt-4' : '')}>2021 Jan 21 <b>Patent Family Updates – </b>The GenomeQuest content team has streamlined the patent family assignment process to increase accuracy and increase update frequency. The new process has resulted in a significant reduction of singletons, updates for newdocuments are now done weekly. Please contact support@gqlifesciences.com with questions or comments.</p>
        <p className={"subHeading" + ' ' + (props.isMostUsedPanel ? 'ml-2 ' : '')}>2020 Oct 27 <b>Antibody Module – </b>The new module has been released! Please join us in a <a href='#' onClick={e => e.preventDefault()}>webinar</a> on November 10th to learn about streamlining your antibody searches.</p></div>
    return (
        <div>
            <div className={classes.newsContent + ' ' + (props.isMostUsedPanel ? classes.newsMostUsedContent : '') + ' ' + (props.isForgotPanel ? classes.forgotNewsContent : '')}>
                <div id="newsUpdateDiv" className="p-3">
                    <h5 className="subHeading"><b>{t('newsandupdates')}</b></h5>
                    {ReactHtmlParser(newsData)}
                    {/* <div dangerouslySetInnerHTML={{__html: newsData}}>

            </div> */}
                </div>
            </div>

            {/* {props.isMostUsedPanel && showMore &&
                <p className="moreLink ml-2"><a className="cursorPointer appLink" onClick={() => setModalShow(true)}>More...</a></p>
            } */}
            <ContentModal show={modalShow} onHide={() => setModalShow(false)} title={t('newsandupdates')} contentdata={newsData} />
        </div>
    );
}

export default Newsupdate;