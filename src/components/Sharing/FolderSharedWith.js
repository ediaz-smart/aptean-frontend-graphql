import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import resultShareImg from '../../assets/image/resultshare.png';
import ShareResultsModal from '../../shared/Modal/ShareResultsModal';
import { toast } from 'react-toastify';
import ShareResultsRemoveModal from '../../shared/Modal/ShareResultsRemoveModal';
import ftAccess from '../../services/ftAccess';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

const FolderSharedWith = (props) => {
    const { t } = useTranslation('common');
    const [modalResultShow, setModalResultShow] = useState(false);
    const [modalResultRemoveShow, setModalResultRemoveShow] = useState(false);

    // const [gqUserId, setGqUserId] = useState();
    const [shareableTo, setShareableTo] = useState([]);
    const [removeData, setRemoveData] = useState([]);
    const userInfo = useSelector(state => state.setUserInfo);

    useEffect(() => {
        props.getSharedWithMe(props.workflowId)
        getShareableTo(props.workflowId)
    }, [])

    const getShareableTo = async (id) => {
        const results = await ftAccess.shareableList(id);
        if (results && results.response_status == 0) {
            setShareableTo(results.response_content);
        }
    }
    const removeSharing = async (users) => {
        const results = await ftAccess.removeAccess(props.workflowId, users.user_id);
        if (results && results.response_status == 0) {
            getShareableTo(props.workflowId);
            props.getSharedWithMe(props.workflowId);
        }
        cancelForm()
    }

    function viewRemoveModal(data) {
        setModalResultRemoveShow(true);
        setRemoveData(data);
    }

    function cancelForm() {
        setModalResultRemoveShow(false);
    }

    const shareFolderWith = async (users) => {
        setModalResultShow(false);
        let usr = users.join(',');

        const getAddShareResponse = await ftAccess.addAccess(props.workflowId, usr);
        if (getAddShareResponse && getAddShareResponse.response_status == 0) {
            props.getSharedWithMe(props.workflowId);
            getShareableTo(props.workflowId);
        } else {
            toast.error('Adding in Error.');
        }
    }

    return (
        <>
            <h6 className={"appTextColor loginTitle"} id="resultSharing">{t('Folder Sharing')}​</h6>
            <Row>
                {/* <Col lg="1" md="1" sm="12" className="pr-0">
                    
                </Col> */}
                <Col lg="12" md="12" sm="12" xs='12' className="p-0 content">
                    <Row style={{ paddingLeft: '15px', display: 'flex', alignItems: 'center' }}>
                        <img style={{ padding: '0 16px' }} src={resultShareImg} alt={t('folderSharing')} />
                        {/* <img className="float-left mx-3" src={resultshareImg} alt="Result sharing"  /> */}
                        <Typography className={(props.sharedWithMe && props.sharedWithMe != "none" ? 'd-block' : 'd-none')}>
                            {t('folderAccess')}. <Link className={"appLink cursorPointer " + (userInfo && userInfo.current_user.gq_user_id === props.gqUserId ? '' : 'd-none')} onClick={() => setModalResultShow(true)} >{t('addMore')} …​</Link></Typography>
                        <Typography className={(props.sharedWithMe && props.sharedWithMe == "none" ? 'd-block' : 'd-none')}>
                            {t('folderNotAccess')}. <Link className={"appLink cursorPointer " + (userInfo && userInfo.current_user.gq_user_id === props.gqUserId ? '' : 'd-none')} onClick={() => setModalResultShow(true)} >{t('shareNow')} …​</Link></Typography>

                        <ShareResultsModal
                            sharedItem='Folder'
                            show={modalResultShow}
                            data={shareableTo}
                            onHide={() => setModalResultShow(false)}
                            shareResult={shareFolderWith}
                            sharedUserId={props.sharedWithMe}
                        />

                    </Row>

                    {props.sharedWithMe && props.sharedWithMe != 'none' && Object.keys(props.sharedWithMe).map((item, i) => {
                        return (
                            <Row key={i} lg="4" md="4" sm='4' xs='4' style={{ marginLeft: '80px' }}>
                                <Col lg="4" md="4" className="pr-0 content">
                                    <Typography >
                                        <RadioButtonUncheckedIcon style={{ fontSize: '11px' }} className="mr-2 mt-2 float-left appTextColor" />{props.sharedWithMe[item].full_name}</Typography>
                                </Col>
                                <Col lg="2" md="2" sm="2" xs='2' className="pr-0 content">
                                    <Typography ><Link className={"failedTextColor " + (userInfo && userInfo.current_user.id === props.gqUserId ? '' : 'd-none')} id={props.sharedWithMe[item].id} onClick={() => viewRemoveModal(props.sharedWithMe[item])}>Remove</Link></Typography>
                                </Col>
                            </Row>
                        )
                    })
                    }
                </Col>
            </Row>

            <ShareResultsRemoveModal
                removingItem={'folder'}
                show={modalResultRemoveShow}
                onHide={() => cancelForm()}
                removeShare={removeSharing}
                onMessage={removeData}
            />
        </>
    );
}

export default FolderSharedWith