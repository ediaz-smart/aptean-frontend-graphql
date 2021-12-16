import Modal from 'react-bootstrap/Modal'
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    modalClassContent: {
        position: 'absolute',
        width: '96%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)'
    },
    modalBoxContent: {
        maxHeight: '675px',
    },
    modalHeader: {
        borderBottom: 'none !important',
        position: 'absolute',
        right: '5px',
        top: '3px',
        zIndex: '1',
        display: "block !important"
    },
    colorContainer: {
        backgroundColor: '#EEEEEE',
        textAlign: 'left',
        margin: '15px 0 12px',
        padding: '15px 15px 50px 15px',
        borderRadius: '5px',
    },
    closeButton: {
        '&:hover': {
            cursor: 'pointer'
        }
    }
}))
const FolderNameAlertModal = props => {
    const classes = useStyles();
    const { t } = useTranslation('common');
    return (
        <Modal
            show={props.showModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcente"
            centered
            contentClassName={classes.modalClassContent}
            className={classes.modalBoxContent}
        >
            <div className={classes.modalHeader}>
                <div className={classes.closeButton} href="#" onClick={(e) => e.preventDefault()}>
                    <CloseIcon onClick={props.closeModal} />
                </div>
            </div>
            <Modal.Body className="appTextColor text-center">
                <div className={classes.colorContainer}>
                    <div>
                        <p style={{ textAlign: 'center', marginBottom: '5px' }}>{t('folderNameNotAllowed')}</p>
                        <p style={{ textAlign: 'center', marginBottom: '5px' }}>{t('plsTryAgain')}</p>
                        <Button onClick={props.closeModal} className="mr-2 accountInfo" color="primary" variant="contained">{t('OK')}</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default FolderNameAlertModal