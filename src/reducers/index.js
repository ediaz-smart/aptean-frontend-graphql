import { combineReducers } from 'redux'

import loginSlice from './slice/loginSlice';
import userServerDataSlice from './slice/userServerDataSlice';

const rootReducer = combineReducers({
  user: loginSlice,
  setUserInfo: userServerDataSlice
})

export default rootReducer