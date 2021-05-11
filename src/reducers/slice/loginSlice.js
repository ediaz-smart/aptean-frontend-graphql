import { createSlice } from '@reduxjs/toolkit';
import { post } from '../../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../url';

const initialState = { isLoggedIn: false }
const API_URL = process.env.REACT_APP_API_URL;

export const submitLogin = (data) => async (dispatch) => {
    console.log('API_URL+url.login', API_URL+url.login)
    dispatch(setUser({ GQUSERID: data.GQUSERID, isLoggedIn: true }));
    return post(API_URL+url.login, data)
        .then((response) => {
            // if (response.status && response.data.sessionData.token) {
            //     jwtService.setSession(response.data.accessToken);
            //     jwtService.setUserObjSession(response.data);
            toast.success('loginSuccess');
            //dispatch(setUser({ GQUSERID: data.GQUSERID, isLoggedIn: true }));
            // window.location.href = "/admin";
            // }

        })
        .catch((error) => {
            toast.error('loginFailed');
            console.log("error::", error);

            // return dispatch(loginError(error));
            // dispatch(showMessage({ message: error }));
        });
};

const loginSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => action.payload
    },
})

export const { setUser } = loginSlice.actions;
export default loginSlice.reducer;