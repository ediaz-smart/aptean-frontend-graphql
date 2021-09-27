import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import CustomPagination from '../../shared/CustomPagination';


const useStyles = makeStyles(() => ({
    blueFont: {
        fontWeight: "600"
    },
    textWrap: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        display: 'block',
    }
}));

function FullTextResults(props) {
    const { data, fullTextCallBack, pageCount, currentPage } = props;
    const { t, i18n } = useTranslation("common");
    const classes = useStyles();

    useEffect(() => {

    });
    function showString(str) {
        let getLength = str.length;
        if (getLength > 500) {
            str = str.substring(0, 500) + ' ...';
        }
        return str;

    }
    console.log('full')
    return (
        <div className="w-75">
            {
                data && data.docs && data.docs.length > 0 && <div>

                    {data.docs.map((item, index) => {
                        return (
                            <div key={index}>
                                <p className={"subHeading"}>
                                    {/* <span className={classes.blueFont + " appLink"}>{item.patentid}</span> */}
                                    <Link to={"/fulldocview/" + item.patentid} className={classes.blueFont + " appLink"} target="_blank">{item.patentid}</Link>
                                    <span> - </span><span>{item.title}</span>
                                </p>
                                <p className={"bodyText"}>
                                    <span>{t('publicationData')}</span><span>{moment(item.pubdate).format('DD-MMM-YYYY')}</span>
                                </p>
                                {item['desc_en_nostem-hl'] && item['desc_en_nostem-hl'].length > 0 && <p className={"bodyText"}>
                                    <span>{t("description")}</span>
                                    <span>{ReactHtmlParser(showString(item['desc_en_nostem-hl'][0]))}</span>
                                </p>}
                                {item['clm_en_nostem-hl'] && item['clm_en_nostem-hl'].length > 0 && <p className={"bodyText"}>
                                    <span>{t("claims")}</span>
                                    <span>{ReactHtmlParser(showString(item['clm_en_nostem-hl'][0]))}</span>
                                </p>}
                                {item['abst_en_nostem-hl'] && item['abst_en_nostem-hl'].length > 0 && <p className={"bodyText"}>
                                    <span>{t("abstract")}</span>
                                    <span>{ReactHtmlParser(showString(item['abst_en_nostem-hl'][0]))}</span>
                                </p>}
                                <hr />
                            </div>
                        );
                    })
                    }
                    <Row>
                        <Col className={'d-flex justify-content-center' + (data && data.docs && data.docs.length > 0 ? ' d-block' : ' d-none')} md="12">
                            <CustomPagination className={"float-right mt-2"} count={data && data.numFound ? data.numFound : 0} changePage={fullTextCallBack} recordPerPage={pageCount} showFirstButton showLastButton defaultPage={1} page={currentPage} />
                        </Col>
                    </Row>
                </div>
            }

        </div>


    )
}

export default FullTextResults;
