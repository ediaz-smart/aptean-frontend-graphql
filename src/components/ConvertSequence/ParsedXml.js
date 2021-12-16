import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Dropdown, MenuItem, DropdownButton } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import TextField from '@material-ui/core/TextField';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import _ from "lodash";


import TextInput from '../../shared/Fields/TextInput';
import SelectBox from '../../shared/Fields/SelectBox';
import Constant from '../../helpers/constant';
import Validate from '../../helpers/validate';
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
    textField: {
        // width: '194px',
        width: '275px',
        padding: '10px 0px',
        margin: '-8px 0 0 -5px'
    },
    antibodyNumInput: {
        width: '8%'
    },
    searchbutton: {
        margin: '4px 0',
        float: 'right',
        textTransform: 'none',
        backgroundColor: '#db862c !important',
        border: '1px solid #ca751b !important',
        color: 'white !important'
    },
    buttonDisable: {
        backgroundColor: '#EEEEEE !important',
        border: '1px solid #a2a2a3 !important',
        float: 'right',
        margin: '4px 4px 4px 4px !important',
        textTransform: 'none !important',
        color: '#777777 !important',
        boxShadow: 'none !important'
    }
}));

function ParsedXml(props) {
    const { t, i18n } = useTranslation('common');
    const classes = useStyles();
    const history = useHistory();
    const [authInfo, setAuthInfo] = useState();
    const [disableSearch, setDisableSearch] = React.useState(false);
    const [blankPage, setBlankPage] = React.useState(false);
    const [formdata, setFormData] = useState({});
    const { workflowId } = useParams();
    const sequence = [];
    var ill = 0;
    if (typeof (props.location.state) !== 'undefined' && props.location.state !== null) {
        sequence[0] = props.location.state[0];
        sequence[1] = props.location.state[1];
        sequence[2] = props.location.state[2];
        sequence[3] = props.location.state[3];
        ill = 1;

    }
    const [searchSeqValue, setSeqType] = useState(sequence[3] == 0 ? "protein" : "nucleotide");
    //const [searchSeqValue, setSeqType] = useState(props.location.state[3] == 0 ? "protein" : "nucleotide");
    const [seqValue, setSeq] = useState(sequence[3] == 0 ? sequence[0] : sequence[1]);
    const userInfo = useSelector(state => state.setUserInfo);
    const [userData, setUserData] = useState();

    useEffect(() => {
        (async () => {
            const getResponse = await searchResAntibody.getAuthInfoAB(workflowId);
            if (getResponse && getResponse.response_status == 0) {
                setAuthInfo(getResponse.response_content);
                updateFormData(getResponse.response_content);
                //setDisableSearch(true);
            }
            //dispatch(userActions.logout()); 
        })()
        if (userInfo && userInfo.current_user) {
            setUserData(userInfo);
        }
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
        history.push('/convertsequence');
    }

    function ipseq() {

        const seqval1 = document.getElementById("st26input").value;
        if (seqval1.length > 0) {
            var lines = '';
            lines = seqval1.split('\n');
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].indexOf('>', 0) == 0) {
                    lines[i] = lines[i].replace(/[ \t]/g, '_');
                }
            }
            const seqval = lines.join('\n');
            history.push({
                pathname: '/ipseqsearch',
                state: {
                    seq: seqval,
                    type: searchSeqValue
                }
            });

        }
        else {
            toast.error("Cannot submit an empty search");
        }
    }

    function ipseqvar() {

        const seqval1 = document.getElementById("st26input").value;
        if (seqval1.length > 0) {
            var lines = '';
            lines = seqval1.split('\n');
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].indexOf('>', 0) == 0) {
                    lines[i] = lines[i].replace(/[ \t]/g, '_');
                }
            }
            const seqval = lines.join('\n');
            console.log(searchSeqValue, "type");
            history.push({
                pathname: '/ipseqvariation',
                state: {
                    seq: seqval,
                    type: searchSeqValue

                }
            });
        }
        else {
            toast.error("Cannot submit an empty search");
        }
    }

    const handleChangee = (event) => {
        setSeq(event.target.value);
        setDisableSearch(false);
        if (typeof (props.location.state) !== 'undefined' && props.location.state !== null) { }
        else {
            setDisableSearch(true);
        }

    }

    function handleChange(e) {
        //this.setState({body: event.target.value});
        //return val;
    }

    const searchSeqItems = [
        {
            value: "protein",
            label: "Work with: Protein sequences"
        },
        {
            value: "nucleotide",
            label: "Work with: Nucleotide sequences"
        }
    ];

    const handleSeqType = (event) => {

        setSeqType(event.target.value);
        setDisableSearch(false);
        if (typeof (props.location.state) !== 'undefined' && props.location.state !== null) {
            if (event.target.value == "nucleotide") {
                if (props.location.state[3] > 0) {
                    setSeq(props.location.state[1]);
                    setDisableSearch(false);
                    //console.log(disableSearch,"disvaluenucif");
                }
                else {

                    setDisableSearch(true);
                    setSeq(props.location.state[1]);
                    //console.log(disableSearch,"disvaluenucelse");

                }
            }
            if (event.target.value == "protein") {
                if (props.location.state[2] > 0) {
                    setSeq(props.location.state[0]);
                    setDisableSearch(false);
                    //console.log(disableSearch,"disvalueprtif");
                }
                else {
                    //document.getElementById("st26input").value='';
                    setDisableSearch(true);
                    setSeq(props.location.state[0]);
                    //console.log(disableSearch,"disvalueprtelse");

                }
            }
        }
        else {
            setDisableSearch(true);
        }

    };

    const formik = useFormik({
        initialValues: {
            st26input: formdata.st26input

        },
        enableReinitialize: true,
        //validationSchema: Validate.AntibodySearchValidation(),
        onSubmit: async (values) => {
            let { st26input } = values;

            let postData = {
                xml_seq: st26input
            }

            const getResponse = await st26service.convertXml(postData, history, t);
            if (getResponse == 0) {
                history.push({
                    pathname: '/home',
                    //state: postData 
                });
            } else {
                toast.error('Error in Search');
            }


        },
    });
    return (
        <div className={classes.grow}>
            <form name="antibodySearchForm" onSubmit={formik.handleSubmit} className={classes.loginDiv}>

                <Row>

                    <Col lg="12" md="12" className="mb-2">

                        <Row className="mb-2">
                            <h6 className={"appTextColor loginTitle"}>ST.26 Sequence Input</h6>
                        </Row>
                        <Row className="mb-2">
                            <h6>
                                {sequence[3]} Nucleotide Sequence and {sequence[2]} Protein sequences were found in the ST.26 input</h6>
                        </Row>
                        <Row className="mb-3">
                            <SelectBox
                                margin="normal"
                                variant="outlined"
                                name="searchType"
                                id="searchType"
                                value={searchSeqValue}
                                items={searchSeqItems}
                                onChange={handleSeqType}
                                className={classes.textField}
                            />
                        </Row>

                        <Row className="mb-3">

                            <Col lg="12" md="12" className="p-0 content float-left">
                                {disableSearch ?
                                    <p></p>
                                    : <TextInput
                                        rows="25"
                                        multiline={true}
                                        fullWidth
                                        id="st26input"
                                        name="st26input"
                                        variant="outlined"
                                        value={seqValue}
                                        //defaultValue={props.location.state[1]}
                                        onChange={handleChangee}
                                        error={formik.touched.st26input && Boolean(formik.errors.st26input)}
                                        helperText={formik.errors.st26input}
                                        disabled={disableSearch}
                                    />

                                }

                            </Col>

                        </Row>
                        <hr />
                    </Col>



                    <Col lg="12" md="12" className="float-right mb-3">

                        {userData && userData.vmAccess && !disableSearch ?
                            <Button className={classes.searchbutton} color="default" disableRipple={true} onClick={ipseqvar} variant="contained">{t('ipseqvariation')}</Button>
                            : <Button className={classes.buttonDisable} color="default" disableRipple={true} variant="contained">{t('ipseqvariation')}</Button>
                        }
                        {userData && !disableSearch ?
                            <Button className={classes.searchbutton} color="default" disableRipple={true} onClick={ipseq} style={{ marginRight: '5px' }} variant="contained" >{t('ipseqsearch')}</Button>
                            : <Button className={classes.buttonDisable} color="default" disableRipple={true} variant="contained">{t('ipseqsearch')}</Button>
                        }
                        <Button variant="contained" color="primary" className={"text-capitalize mr-2 float-right primaryBtn "} style={{ marginTop: '5px' }} onClick={cncl}>{t('cancel')}</Button>
                    </Col>
                </Row>

            </form>

        </div>

    )

}

export default ParsedXml;