import { useTranslation, } from "react-i18next";
import * as yup from 'yup';


const Validate = {
    LoginValidate,
    ForgotValidate
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
export default Validate;