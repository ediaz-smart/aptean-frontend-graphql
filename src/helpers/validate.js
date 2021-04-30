import { useTranslation, } from "react-i18next";
import * as yup from 'yup';


const Validate = {
    LoginValidate,
    ForgotValidate
};

function LoginValidate() {
    const { t, i18n } = useTranslation('common');
    const validationSchema = yup.object({
        username: yup
            .string(t('enterUsername'))
            .required(t('usernameReq')),
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
        username: yup
            .string(t('enterUsername'))
            .required(t('usernameReq')),
        captchaCode: yup
            .string(t('codeShown'))
            .required(t('codeReq')),
    });
    return validationSchema;
}
export default Validate;