import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import TextInput from '../../shared/Fields/TextInput';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        width: "96%",
        margin: "0 auto 28px",
        minHeight: "260px",
        borderBottom: "1px solid #cec7c7",
        padding: "23px 0 5px",
    },
}));

function FullTextSearch() {
    const { t, i18n } = useTranslation("common");
    const classes = useStyles();
    const [fulltext,setFullText] = useState();

    // reset login status
    useEffect(async () => {
        //dispatch(userActions.logout());
    }, []);
    return (
        <div className={classes.grow}>
            <Row>
                <Col md="10" lg="10">
                    <p className="loginTitle">{t('fulltext')}</p>
                    <div className="form-group">
                        <TextInput
                            rowsMax="8"
                            rows="8"
                            multiline={true}
                            fullWidth
                            id="fulltext"
                            name="fulltext"
                            label={t('fulltext')}
                            variant="outlined"
                            value={fulltext || ''}
                            // onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default FullTextSearch;
