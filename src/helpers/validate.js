import { useTranslation, } from "react-i18next";
import * as yup from 'yup';
import { number } from "yup/lib/locale";


const Validate = {
    LoginValidate,
    ForgotValidate,
    NewPassValidate,
    IpSeqSearchValidate,
    InformationDataValidate,
    ChangePasswordValidate,
    AntibodySearchValidation,
    MergeResultsValidate    
};

function LoginValidate() {
    const { t, i18n } = useTranslation('common');
    const validationSchema = yup.object({
        userName: yup
            .string(t('enterconfirmPassword'))
            .required(t('confirmPasswordReq')),
        password: yup
            .string(t('enterPass'))
            // .min(8, t('passMinChar'))
            .required(t('passwordReq')),
    });
    return validationSchema;
}
function NewPassValidate() {
    const { t, i18n } = useTranslation('common');
    const validationSchema = yup.object({
        newPassword: yup
            .string(t('enternewPassword'))
            .min(9, 'Password is too short - should be 9 chars minimum.')
            .matches("^(?=.*[a-z])", 'Password should contain at least one lowercase letter.')
            .matches("^(?=.*[A-Z])", 'Password should contain at least one uppercase letter.')
            .matches("^(?=.*[0-9])", 'Password should contain at least one numbers.')
            .required(t('newPasswordReq')),
        confirmPassword: yup
            .string(t('enterconfirmPassword'))
            .min(9, 'Password is too short - should be 9 chars minimum.')
            .matches("^(?=.*[a-z])", 'Password should contain at least one lowercase letter.')
            .matches("^(?=.*[A-Z])", 'Password should contain at least one uppercase letter.')
            .matches("^(?=.*[0-9])", 'Password should contain at least one numbers.')
            .required(t('confirmPasswordReq')),
    });
    return validationSchema;
}
function ForgotValidate() {
    const { t, i18n } = useTranslation('common');
    const validationSchema = yup.object({
        userName: yup
            .string(t('enteruserName'))
            .required(t('userNameReq')),
        captchaCode: yup
            .string(t('codeShown'))
            .required(t('codeReq')),
    });
    return validationSchema;
}
function InformationDataValidate() {
    const { t, i18n } = useTranslation('common');
    const validationSchema = yup.object({
        firstName: yup
            .string(t('enterfirstName'))
            .required(t('firstNameReq')),
        lastName: yup
            .string(t('enterlastName'))
            .required(t('lastNameReq')),
        confirmPassword: yup
            .string(t('enterconfirmPassword'))
            .required(t('confirmPasswordReq')),

    });
    return validationSchema;
}
function ChangePasswordValidate() {
    const { t, i18n } = useTranslation('common');
    const validationSchema = yup.object({
        currentPassword: yup
            .string(t('entercurrentPassword'))
            .required(t('currentPasswordReq')),
        newPassword: yup
            .string(t('enternewPassword'))
            .min(9, 'Password is too short - should be 9 chars minimum.')
            .matches("^(?=.*[a-z])", 'Password should contain at least one lowercase letter.')
            .matches("^(?=.*[A-Z])", 'Password should contain at least one uppercase letter.')
            .matches("^(?=.*[0-9])", 'Password should contain at least one numbers.')
            .required(t('newPasswordReq')),
        confirmPassword: yup
            .string(t('enterconfirmPassword'))
            .min(9, 'Password is too short - should be 9 chars minimum.')
            .matches("^(?=.*[a-z])", 'Password should contain at least one lowercase letter.')
            .matches("^(?=.*[A-Z])", 'Password should contain at least one uppercase letter.')
            .matches("^(?=.*[0-9])", 'Password should contain at least one numbers.')
            .required(t('confirmPasswordReq')),


    });
    return validationSchema;
}

function IpSeqSearchValidate(seqType, saveFormValue, searchAlgorithm, isPatientDoc) {
    console.log('seqType', seqType, searchAlgorithm)
    const { t, i18n } = useTranslation('common');
    let validationShape = {
        searchDetails: yup
            .string()
            .required(t('searchNameRequired'))
            .max(188, t('188OnlyAllowed'))
            .trim(),
        alignments: yup
            .number()
            .integer(t('valueMustBeInteger'))
            .required(t('alignmentsReq'))
            .typeError(t('alignmentsNotNumber'))
            .min(1, t('alignmentNotValid'))
            .max(1000000, t('alignmentNotValid')),
        minResidues: yup
            .number()
            .integer(t('valueMustBeInteger'))
            .required(t('required'))
            .typeError(t('notNumber'))
            .typeError(t('notNumber'))
            .min(3, t('minResiduesNotValid')),
        maxResidues: yup
            .number()
            .integer(t('valueMustBeInteger'))
            .required(t('required'))
            .typeError(t('notNumber'))
            .min(3, t('minResiduesNotValid')),
        // querySequence: yup
        //     .string()
        //     .required(t('querySeqReq')),
        querySequence: yup
            .string()
            // .required(t('querySeqReq'))
            .validateSeq(t('onlyAlphabetsAllowed')),
    };


    /*if (seqType && seqType == "nucleotide") {
        validationShape.querySequence = yup
            .string()
            .required(t('querySeqReq'))
            .matches(/^[ACGTURYKMSWBDHVNacgturykmswbdhvn]+$/, t("onlyAtgcnAllowed"))
    } else {
        validationShape.querySequence = yup
            .string()
            .required(t('querySeqReq'))
            .matches(/^[aA-zZ\s]+$/, t("onlyAlphabetsAllowed"))
    }*/
    if (saveFormValue) {
        validationShape.formName = yup
            .string()
            .required(t('required'))
            .max(48, t('48OnlyAllowed'))
            .trim()
    }
    if(searchAlgorithm && searchAlgorithm == "kerr") {
        validationShape.genePastPercentage = yup
            .number()
            .integer(t('valueMustBeInteger'))
            .required(t('genePastPercentageReq'))
            .min(65, t('genePastPercentageIncorrect'))
            .max(100, t('genePastPercentageIncorrect'))
            .typeError(t('genePastPercentageIncorrect'))
    } else if(searchAlgorithm && searchAlgorithm == "blast") {
        validationShape.expectCutoff = yup
            .number()
            .required(t('expectCutoffRequired'))
            .typeError(t('expectCutoffNotNumber'))
            .min(0, t('expectCutOffErr'))
            .max(100, t('expectCutOffErr'))
    } else if(searchAlgorithm && searchAlgorithm == "fragment") {
        console.log('fragSeq', seqType)
        validationShape.fragmentStretch = yup
            .number()
            .integer(t('valueMustBeInteger'))
            .required(t('fragmentStretchRequired'))
            .typeError(t('fragmentStretchNotNumber'))
            .min(1, t('fragmentStretchNotNumber'))
            if(seqType && seqType == "nucleotide") {
                validationShape.fragmentAminoAcid = yup
                .number()
                .integer(t('valueMustBeInteger'))
                .required(t('genePastPercentageReq'))
                .min(91, t('fragmentNucPerError'))
                .max(100, t('fragmentNucPerError'))
                .typeError(t('fragmentNucPerError'))
                validationShape.fragmentStretch = yup
                .number()
                .integer(t('valueMustBeInteger'))
                .required(t('fragmentStretchRequired'))
                .typeError(t('fragmentStretchNotNumber'))
                .min(10, t('fragNucStretchError'))
                .max(1000, t('fragNucStretchError'))
            } else if(seqType && seqType == "protein") {
                validationShape.fragmentAminoAcid = yup
                .number()
                .integer(t('valueMustBeInteger'))
                .required(t('genePastPercentageReq'))
                .min(81, t('fragmentProPerError'))
                .max(100, t('fragmentProPerError'))
                .typeError(t('fragmentProPerError'))
                validationShape.fragmentStretch = yup
                .number()
                .integer(t('valueMustBeInteger'))
                .required(t('fragmentStretchRequired'))
                .typeError(t('fragmentStretchNotNumber'))
                .min(5, t('fragProStretchError'))
                .max(1000, t('fragProStretchError'))
            }
    } 
    if(isPatientDoc) {
        validationShape.patientDocInp = yup
            .number()
            .integer(t('valueMustBeInteger'))
            .min(1, t('shouldBeGreaterThanZero'))
            .typeError(t('notNumber'))
            .required(t('required'))
    }

    const validationSchema = yup.object().shape(validationShape);

    return validationSchema;
}
yup.addMethod(yup.string, "validateCdr", function (message) {
    // const { message } = args;
    // console.log(args,'args');
    return yup.mixed().test(`validateCdr`, message, function (value) {
        const { path, createError } = this;
        let isValid = true;
        if (value) {
            let isValid = true;
            value = value.replace(/\s+/g, '');
            if (value.length > 64 || value.length < 3) {
                isValid = false;
            } else {
                let letters = /^[A-Za-z]+$/;
                isValid = value.match(letters);
            }
            return isValid || createError({ path, message });
        }else {
            return isValid || createError({ path, message });
        }


    })
})
yup.addMethod(yup.string, "validateMismatch", function (seqType) {
    // const { message } = args;
    // console.log(yup.mixed().parent,'data');
    return yup.mixed().test(`validateMismatch`, function (val,ctx) {
        const { path, createError } = this;
        let message = '';
        let isValid = true;
        if (val && val !== undefined && val !== 'undefined') {
            // let keyValue = "cdrhcseq"+num;
            let text = ctx.parent[seqType];
            let isValid = true;
            // value = value.replace(/\s+/g, '');
            let maxVal = 0;
            if(text)
            {
                maxVal = Math.floor(text.length / 5);
            }
            if (val !== undefined && val !== null && val >= 0 && val <= maxVal) {
            } else {
                message = 'Please input a number between 0 and ' + maxVal;
                isValid = false;
            }
            return isValid || createError({ path, message });
        }else {
            return isValid || createError({ path, message });
        }


    })
})
yup.addMethod(yup.string, "validateStrategy", function (strategyType,t) {
    // const { message } = args;
    // console.log(yup.mixed().parent,'data');
    return yup.mixed().test(`validateStrategy`, function (val,ctx) {
        const { path, createError } = this;
        let message = '';
        let isValid = true;
        if (val && val !== undefined && val !== 'undefined') {
            // let keyValue = "cdrhcseq"+num;
            let text = ctx.parent[strategyType];
            let isValid = true;
            if(text =='genepast' && path == "percId")
            {
                if (val < 65 || val > 100) {
                    isValid = false;
                    message = t('percErr');
                }
            }else {
                if(path == "expectCutoff")
                {
                    if (val < 0 || val > 100) {
                        isValid = false;
                        message = t('expectCutOffErr');
                    }
                }else if(path == "wordSize"){
                    if (val < 2 || val > 3) {
                        isValid = false;
                        message = t('wordSizeErr');
                    }
                }
            }
            return isValid || createError({ path, message });
        }else {
            return isValid || createError({ path, message });
        }


    })
})
yup.addMethod(yup.string, "validateSeq", function (message) {
    const { t, i18n } = useTranslation('common');
    // const { message } = args;
    // console.log(args,'args');
    return yup.mixed().test(`validateSeq`,message, function (text) {
        const { path, createError } = this;
        let isValid = true;
        let val = 0;
        let returnMsg='';
        console.log('requiredMsg', t('required'))
        if (text && text !== undefined && text !== 'undefined') {
            returnMsg = message;
            let lines = text.split(/[\r\n]+/); // split by \n, \r and \r\n, and filter out empty lines
            if (/^\s*>\s*\S+/.test(text)) { // FASTA
                // count > numbers
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].substring(0, 1) === '>' && (i + 1) < lines.length && lines[i + 1].substring(0, 1) !== '>') {
                        val++;
                    }
                }
            } else if (/^\s*\@\s*\S+/.test(text)) { // FASTAQ
                //val = lines.length / 4;
                isValid = false;
            } else if (/^\s*!!/.test(text)) { // ST25
                isValid = false;
            } else if (/^\s*;/.test(text)) { // CIPO
                isValid = false;
            }
            else {
                // Appends ">seq_1\n" and treats as FASTA, refer to DlRawSeqdb.php
                text = ">seq_1\n" + text;
                lines = text.split(/[\r\n]+/);
                // count > numbers
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].substring(0, 1) === '>' && (i + 1) < lines.length && lines[i + 1].substring(0, 1) !== '>') {
                        val++;
                    }
                    if (lines[i].substring(0, 2) === '//') { // EMBL format
                        isValid = false;
                        break;
                    }
                }
            }
            if (val > 1 && path != 'querySequence') {
                isValid = false;
            }
            return isValid || createError({ path, message: returnMsg });
        }else {
            if(path == 'querySequence' && val == 0) {
                isValid = false;
                returnMsg = t('querySeqReq');
            }
            return isValid || createError({ path, message: returnMsg });
        }

    })
})
function AntibodySearchValidation(saveFormValue) {
    // console.log('seqType', seqType)
    const { t, i18n } = useTranslation('common');

    let validationShape = {
        searchName: yup
            .string()
            .required(t('searchNameRequired'))
            .max(188, t('188OnlyAllowed')),
        cdrhcseq1: yup.string()
            .validateCdr(t('sequenceTextErr')),
            // .required(t('cdrhc1Req')),
        cdrhcseq2: yup.string()
            .validateCdr(t('sequenceTextErr')),
            // .required(t('cdrhc2Req')),
        cdrhcseq3: yup.string()
            .validateCdr(t('sequenceTextErr')),
            // .required(t('cdrhc3Req')),
        hcOption1: yup.string()
            .validateMismatch('cdrhcseq1'),
        hcOption2: yup.string()
            .validateMismatch('cdrhcseq2'),
        hcOption3: yup.string()
            .validateMismatch('cdrhcseq3'),
        cdrlcseq1: yup.string()
            .validateCdr(t('sequenceTextErr')),
            // .required(t('cdrhc1Req')),
        cdrlcseq2: yup.string()
            .validateCdr(t('sequenceTextErr')),
            // .required(t('cdrhc2Req')),
        cdrlcseq3: yup.string()
            .validateCdr(t('sequenceTextErr')),
            // .required(t('cdrhc3Req')),
        lcOption1: yup.string()
            .validateMismatch('cdrlcseq1'),
        lcOption2: yup.string()
            .validateMismatch('cdrlcseq2'),
        lcOption3: yup.string()
            .validateMismatch('cdrlcseq3'),
        percId: yup.string()
            .validateStrategy('strategy',t),
        expectCutoff: yup.string()
            .validateStrategy('strategy',t),
        wordSize: yup.string()
            .validateStrategy('strategy',t),
        hcFullSeq: yup.string()
            .validateSeq(t('fullSeqErr')),
        lcFullSeq: yup.string()
            .validateSeq(t('fullSeqErr')),

    }
    if (saveFormValue) {
        validationShape.formName = yup
            .string()
            .required(t('required'))
            .max(48, t('48OnlyAllowed'))
            .trim()
    }

    const validationSchema = yup.object().shape(validationShape);
    return validationSchema;
}

yup.addMethod(yup.string, "validateFormName", function(message, isSaveForm) {
    return yup.mixed().test(`validateFormName`, message, function () {
        const { path, createError } = this;
        let isValid = true;
        if(isSaveForm){
            isValid = false;
        }
        return isValid || createError(path, message)
    })
});

function MergeResultsValidate() {
    const { t, i18n } = useTranslation('common');
    const validationSchema = yup.object({
        title: yup
            .string()
            .required(t('required'))
    });
    return validationSchema;
}

export default Validate;