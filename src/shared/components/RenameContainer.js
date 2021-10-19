import React, { useEffect, useRef } from 'react'
import { Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

const RenameContainer = props => {
    const { t } = useTranslation('common');
    const tempNameRef = useRef(props.nameRef.current)
    const inputRef = useRef(null)
    const handleCancelButtonClick = () => {
        props.setRenameEnabled(false)
    }
    useEffect(() => {
        inputRef.current.focus()
    })
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
        }
    }))
    const classes = useStyles();
    // const renameFolderContainer = {
    //     display: 'flex',
    //     flexDirection: 'row',
    //     marginBottom: '10px',
    //     alignItems: 'center'
    // }

    const inputElementStyle = {
        height: '39px',
        fontSize: '14px',
        outline: 'none',
        borderRadius: '6px',
        padding: '1px 10px',
        border: '1px solid #ccc',
        '&:placeholder': {
            fontStyle: 'italic'
        }
    }

    const handleApplyButtonClick = (e) => {
        e.stopPropagation()
        if (tempNameRef.current.length > 0) {
            props.applyNewName(tempNameRef.current)
        }
    }
    const handleChange = e => {
        tempNameRef.current = e.target.value
    }
    return (
        <div className={classes.renameFolderContainer}>
            <input style={inputElementStyle}
                type={'text'}
                onInput={handleChange} ref={inputRef}
                maxLength={props.maxLength}
                defaultValue={tempNameRef?.current ? tempNameRef.current : ''}
                placeholder={props.placeHolderText} />
            <Button variant="contained" disableRipple={true} className={props.cancelButtonClass} onClick={handleCancelButtonClick}>{t('cancel')}</Button>
            <Button className={classes.applyButtonStyle} onClick={handleApplyButtonClick}>
                {t("Apply")}
            </Button>
        </div>
    )
}

export default RenameContainer