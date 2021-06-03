import { useTranslation, } from "react-i18next";
import * as yup from 'yup';
import { number } from "yup/lib/locale";


const Validate = {
    LoginValidate,
    ForgotValidate,
    IpSeqSearchValidate,
    InformationDataValidate,
    ChangePasswordValidate
};

function LoginValidate() {
    const { t, i18n } = useTranslation('common');
    const validationSchema = yup.object({
        userName: yup
            .string(t('enteruserName'))
            .required(t('userNameReq')),
        password: yup
            .string(t('enterPass'))
            .min(8, t('passMinChar'))
            .required(t('passwordReq')),
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

function IpSeqSearchValidate(seqType) {
    console.log('seqType', seqType)
    const { t, i18n } = useTranslation('common');
    let validationShape = {
        searchDetails: yup
            .string()
            .required(t('searchNameRequired'))
            .max(200, t('200OnlyAllowed')),
        alignments: yup
            .number()
            .required(t('alignmentsReq'))
            .typeError(t('alignmentsNotNumber')),
        genePastPercentage: yup
            .number()
            .required(t('genePastPercentageReq'))
            .min(1, 'genePastPercentageIncorrect')
            .max(100, 'genePastPercentageIncorrect')
            .typeError(t('genePastPercentageIncorrect')),
        expectCutoff: yup
            .number()
            .required(t('expectCutoffRequired'))
            .typeError(t('expectCutoffNotNumber')),
        fragmentStretch: yup
            .number()
            .required(t('fragmentStretchRequired'))
            .typeError(t('fragmentStretchNotNumber'))
            .min(1, 'fragmentStretchNotNumber'),
        minResidues: yup
            .number()
            .required(t('required'))
            .typeError(t('notNumber')),
        maxResidues: yup
            .number()
            .required(t('required'))
            .typeError(t('notNumber')),
    };


    if (seqType && seqType == "nucleotide") {
        validationShape.querySequence = yup
                .string()
                .required(t('querySeqReq'))
                .matches(/^[ACGTURYKMSWBDHVNacgturykmswbdhvn]+$/, t("onlyAtgcnAllowed"))
    } else {
        validationShape.querySequence = yup
                .string()
                .required(t('querySeqReq'))
                .matches(/^[aA-zZ\s]+$/, t("onlyAlphabetsAllowed"))
    }
    const validationSchema = yup.object().shape(validationShape);

    return validationSchema;
}
export default Validate;