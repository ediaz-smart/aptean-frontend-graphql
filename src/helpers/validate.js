import { useTranslation, } from "react-i18next";
import * as yup from 'yup';
import { number } from "yup/lib/locale";


const Validate = {
    LoginValidate,
    ForgotValidate,
    IpSeqSearchValidate
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

function IpSeqSearchValidate() {
    const { t, i18n } = useTranslation('common');
    const validationSchema = yup.object({
        searchDetails: yup
            .string()
            .required(t('searchNameRequired'))
            .max(200, t('200OnlyAllowed')),
        querySequence: yup
            .string()
            .required(t('querySeqReq')),
        alignments: yup
            .number(t('alignmentsNotNumber'))
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
            .min(1, 'fragmentStretchNotNumber')
    });
    return validationSchema;
}
export default Validate;