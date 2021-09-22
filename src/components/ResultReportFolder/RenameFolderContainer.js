import React, { useRef, useEffect } from 'react'
import { Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

const RenameFolderContainer = props => {
    const { t } = useTranslation('common');
    const tempFolderNameRef = useRef(props.folderNameRef.current)
    const inputRef = useRef(null)
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [])
    const useStyles = makeStyles((theme) => ({
        applyButtonStyle: {
            float: 'right',
            // margin: '4px',
            textTransform: 'none !important',
            backgroundColor: '#db862c!important',
            border: '1px solid #ca751b!important',
            color: 'white !important'
        },
        renameFolderContainer: {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '10px',
            alignItems: 'center'
        },
        inputElementStyle: {
            height: '33px',
            fontSize: '14px',
            outline: 'none',
            borderRadius: '4px',
            padding: '1px 10px',
            border: '1px solid #ccc',
            '&:placeholder': {
                fontStyle: 'italic'
            }
        }
    }))
    const classes = useStyles();

    const handleCancelButtonClick = () => {
        props.setRenameFolder(false)
    }
    const handleApplyButtonClick = (e) => {
        e.stopPropagation()
        if (tempFolderNameRef.current.length > 0) {
            props.applyNewName(tempFolderNameRef.current)
            handleCancelButtonClick()
        }
    }
    const handleChange = e => {
        tempFolderNameRef.current = e.target.value
    }

    return (
        <div className={classes.renameFolderContainer}>
            <input className={classes.inputElementStyle}
                onInput={handleChange} ref={inputRef}
                defaultValue={props.value} placeholder={'Folder Name'} />
            <Button variant="contained" disableRipple={true} className={props.cancelButtonClass} onClick={handleCancelButtonClick}>{t('cancel')}</Button>
            <Button className={classes.applyButtonStyle} onClick={handleApplyButtonClick}>
                {t("Apply")}
            </Button>
        </div>
    )
}

export default RenameFolderContainer