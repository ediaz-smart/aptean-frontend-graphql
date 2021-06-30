import { createSlice } from '@reduxjs/toolkit';
import { get } from '../../helpers/fetchServicesMethods';
import { toast } from 'react-toastify';
import { url } from '../url';


const initialState = { current_user : {} };

export const getPageCount=() => async(dispatch) =>{
    return get(url.getPageCount, null)
        .then(async (response) => {
            if(response && response.response_status == 0)
            {
                console.log('getPageCount', response.response_content)
                dispatch(setCommon(response.response_content));
            }else {
                if(response && typeof response.response_content === 'object' && response.response_content !== null){
                    console.log(response.response_content.message);
                }
            }
        })
        .catch((error) => {
            console.log("error::", error);
        });
};

const commonSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setCommon: (state, action) => action.payload
    },
})

export const { setCommon } = commonSlice.actions;
export default commonSlice.reducer;