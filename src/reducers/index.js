import { combineReducers } from 'redux'

import loginSlice from './slice/loginSlice';

const rootReducer = combineReducers({
  user: loginSlice
})

export default rootReducer