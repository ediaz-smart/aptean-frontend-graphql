import React, { useState, useCallback, useEffect, Fragment, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import TextField from '@material-ui/core/TextField';
import utilsService, { TOAST_TYPE } from '../../helpers/utils'
import _ from "lodash";


import TextInput from '../../shared/Fields/TextInput';
import SelectBox from '../../shared/Fields/SelectBox';
import Constant from '../../helpers/constant';
import CheckBox from '../../shared/Fields/CheckBox';
import Validate from '../../helpers/validate';
import SearchPrompt from '../../shared/Modal/SearchPromptModal'
import searchResAntibody from '../../services/searchResAntibody';
import st26service from '../../services/st26service';




const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        width: '96%',
        margin: '0 auto 28px',
        minHeight: '260px',
        // borderBottom: '1px solid #cec7c7',
        padding: '23px 16px 14px',
    },
    headerPipe: {
        margin: '0 10px'
    },
    searchInput: {
        width: '30%'
    },
    buttonStyleCancel: {
        float: 'right',
        textTransform: 'none',
        margin: '4px',
        color: 'white',
        backgroundColor: '#008EC5 !important',
        border: '1px solid #1F4E79 !important',
        boxShadow: 'none',
        '&:hover': {
            boxShadow: 'none',
        }
    },

    antibodyNumInput: {
        width: '8%'
    }
}));

function ConvertSequence() {
    const { t, i18n } = useTranslation('common');

    const classes = useStyles();
    const history = useHistory();
    const [selectData, setSelectData] = useState();
    const [searchModal, setSearchModal] = useState(false);
    // const [strategy, setStrategy] = useState('genepast');
    const [authInfo, setAuthInfo] = useState();
    // const [workflowId, setWorkflowId] = useState();
    const [patientDBData, setPatientDBData] = useState(Constant.patientSearchDatabases);
    const [disableSearch, setDisableSearch] = React.useState(false);
    const [formdata, setFormData] = useState({});
    const { workflowId } = useParams();
    const toastRef = useRef(null)


    useEffect(async () => {
        const getResponse = await searchResAntibody.getAuthInfoAB(workflowId);
        if (getResponse && getResponse.response_status == 0) {
            setAuthInfo(getResponse.response_content);
            updateFormData(getResponse.response_content);
            //setDisableSearch(true);
        }
        //dispatch(userActions.logout()); 
    }, []);
    function updateFormData(data) {
        setFormData(data.formData);
        var expiredTime = data.expiredTime;
        if (expiredTime && expiredTime.date) {
            var expiredTimeInSecs = Math.round(new Date(expiredTime.date).getTime() / 1000);
            // Sets the session timeout based on the user expired time in database, -90 for timeout 60 secs and 30 more buffer
            expiredTimeInSecs = expiredTimeInSecs - Math.round(new Date().getTime() / 1000) - 90;
            // Idle.setIdle(expiredTimeInSecs < 0 ? (30 * 59) : expiredTimeInSecs);
            //Idle.watch();
        }
    }

    function cncl() {
        history.push('/home');
    }

    const formik = useFormik({
        initialValues: {
            st26input: formdata.st26input

        },
        enableReinitialize: true,
        //validationSchema: Validate.AntibodySearchValidation(),
        onSubmit: async (values) => {
            let { st26input } = values;

            let postData = {
                st26input
            }

            var getResponse = await st26service.convertXml(postData, history, t);
            if (getResponse == 'parsererror') {
                utilsService.showToast(TOAST_TYPE.ERROR, 'The ST.26 data is not correctly structured.\nPlease correct the XML and try again.', toastRef)
            } else if (getResponse == 'missing') {
                utilsService.showToast(TOAST_TYPE.ERROR, 'The ST.26 data is not correctly structured.\nEither the moltype or Sequence data  is missing.', toastRef);
            }
            else if (getResponse == 'empty') {
                utilsService.showToast(TOAST_TYPE.ERROR, 'The ST.26 xml has no sequence data to be parsed.', toastRef)
            }
            else {
                history.push({
                    pathname: '/parsedxml',
                    state: getResponse
                });
            }

        },
    });
    return (
        <div className={classes.grow}>
            <form name="antibodySearchForm" onSubmit={formik.handleSubmit} className={classes.loginDiv}>

                <Row>
                    <Col lg="12" md="12" className={"mb-2 " + (authInfo && !authInfo.syscontrol_search_submit ? 'd-block' : 'd-none')}>
                        <Typography className="text-danger">
                            {t('ABsearchDisableText')}
                            {authInfo && authInfo.syscontrol_search_submit_txt}
                            {t('patienceThanksText')}</Typography>
                    </Col>

                    <Col lg="12" md="12" className="mb-2">
                        <h6 className={"appTextColor loginTitle"}>ST.26 Sequence Input</h6>
                        <Row className="mb-3">

                            <Col lg="12" md="12" className="p-0 content float-left">
                                <div className="form-group px-3 ">
                                    <TextInput

                                        rows="20"
                                        multiline={true}
                                        fullWidth
                                        id="st26input"
                                        name="st26input"
                                        label="Copy and Paste your ST.26 XML sequences here"
                                        variant="outlined"
                                        value={formik.values.st26input}
                                        onChange={formik.handleChange}
                                        error={formik.touched.st26input && Boolean(formik.errors.st26input)}
                                        helperText={formik.errors.st26input}
                                    //disabled={authInfo && authInfo.redo}
                                    />
                                </div>

                            </Col>

                        </Row>
                        <hr />
                    </Col>

                    <Col lg="12" md="12" className="float-right mb-3">

                        {!formik.values.st26input ?
                            <Button className='cancelButtonDisable' color="default" disableRipple={true} variant="contained">{t('Next')}</Button>
                            : <Button className='accountInfo' color="default" disableRipple={true} type="submit" variant="contained">{t('Next')}</Button>
                        }
                        <Button variant="contained" disableRipple={true} color="default" className={classes.buttonStyleCancel} onClick={cncl}>{t('cancel')}</Button>
                    </Col>
                </Row>

            </form>

        </div>

    )

}

export default ConvertSequence;