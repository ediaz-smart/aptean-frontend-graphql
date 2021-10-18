import React, { useState, useCallback, useEffect, Fragment, useRef } from 'react';
import ReactDOM from "react-dom";
import { useHistory, useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from "@material-ui/core/Checkbox";
import { useTranslation } from "react-i18next";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import Button from '@material-ui/core/Button';
import { format } from 'date-fns';
import _ from "lodash";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal'
import resultshareImg from '../../assets/image/resultshare.png';
import searchResSequence from '../../services/searchResSequence';
import ShareResultsModal from '../../shared/Modal/ShareResultsModal';
import ShareResultsRemoveModal from '../../shared/Modal/ShareResultsRemoveModal';
import ftAccess from '../../services/ftAccess';
import { setUserInfo } from '../../reducers/slice/userServerDataSlice';

function SharedWith(props) {

    const { t, i18n } = useTranslation('common');

    const [modalResultShow, setModalResultShow] = useState(false);
    const [modalResultRemoveShow, setModalResultRemoveShow] = useState(false);

    const [gqUserId, setGqUserId] = useState();
    const [workflowId, setWorkflowId] = useState();

    const [removeData, setRemoveData] = useState([]);

    const userInfo = useSelector(state => state.setUserInfo);

    const [sharedWithMe, setSharedWithMe] = useState([]);
    const [shareableTo, setShareableTo] = useState([]);

    useEffect(async () => {

        setWorkflowId(props.workflowId);
        setGqUserId(props.gqUserId);

        getSharedWithMe(props.workflowId);
        getShareableTo(props.workflowId);

    }, []);


    const getSharedWithMe = async (id) => {
        const results = await ftAccess.sharedWithMe(id);
        if (results && results.response_status == 0) {
            setSharedWithMe(results.response_content);
        }
    }

    const getShareableTo = async (id) => {
        const results = await ftAccess.shareableList(id);
        if (results && results.response_status == 0) {
            setShareableTo(results.response_content);
        }
    }

    const removeSharing = async (usrs) => {
        const results = await ftAccess.removeAccess(workflowId, usrs.user_id);
        if (results && results.response_status == 0) {
            getShareableTo(workflowId);
            getSharedWithMe(workflowId);
        }
    }

    function viewRemoveModal(data) {
        setModalResultRemoveShow(true);
        setRemoveData(data);
    }

    function cancelForm() {
        setModalResultRemoveShow(false);
    }

    const shareResultsForm = async (usrs) => {
        setModalResultShow(false);
        let usr = usrs.join(',');

        const getaddShareResponse = await ftAccess.addAccess(workflowId, usr);
        if (getaddShareResponse && getaddShareResponse.response_status == 0) {
            getSharedWithMe(workflowId);
            getShareableTo(workflowId);
        } else {
            toast.error('Adding in Error.');
        }
    }

    return (
        <>
            <h6 className={"appTextColor loginTitle"} id="resultSharing">{t('resSharing')}​</h6>
            <Row>
                <Col lg="1" md="1" sm="12" className="pr-0">
                    <img src={resultshareImg} alt={t('resSharing')} />
                </Col>
                <Col lg="8" md="9" sm="12" className="p-0 content">
                    <Row>
                        {/* <img className="float-left mx-3" src={resultshareImg} alt="Result sharing"  /> */}
                        <Typography className={"mb-2 " + (sharedWithMe && sharedWithMe != "none" ? 'd-block' : 'd-none')}>
                            {t('resultAccess')}. <Link className={"appLink cursorPointer " + (userInfo && userInfo.current_user.gq_user_id === gqUserId ? '' : 'd-none')} onClick={() => setModalResultShow(true)} >{t('addMore')} …​</Link></Typography>
                        <Typography className={"mb-2 " + (sharedWithMe && sharedWithMe == "none" ? 'd-block' : 'd-none')}>
                            {t('resultNotAccess')}. <Link className={"appLink cursorPointer " + (userInfo && userInfo.current_user.gq_user_id === gqUserId ? '' : 'd-none')} onClick={() => setModalResultShow(true)} >{t('shareNow')} …​</Link></Typography>

                        <ShareResultsModal
                            show={modalResultShow}
                            data={shareableTo}
                            onHide={() => setModalResultShow(false)}
                            //getSelectUser={getSelectUser}
                            shareResult={shareResultsForm}
                            sharedUserId={sharedWithMe}
                        // onMessage={errorMessage}
                        />

                    </Row>

                    {sharedWithMe && sharedWithMe != 'none' && Object.keys(sharedWithMe).map((item, i) => {
                        return (
                            <Row key={i}>
                                <Col lg="4" md="4" className="pr-0 content">
                                    <Typography >
                                        <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" />{sharedWithMe[item].full_name}</Typography>
                                </Col>
                                <Col lg="4" md="4" className="pr-0 content">
                                    <Typography ><Link className={"failedTextColor " + (userInfo && userInfo.current_user.id === gqUserId ? '' : 'd-none')} id={sharedWithMe[item].id} onClick={() => viewRemoveModal(sharedWithMe[item])}>Remove</Link></Typography>
                                </Col>
                            </Row>
                        )
                    })
                    }
                </Col>
            </Row>

            <ShareResultsRemoveModal
                show={modalResultRemoveShow}
                onHide={() => cancelForm()}
                removeShare={removeSharing}
                onMessage={removeData}
            />
        </>
    );
}

export default SharedWith;