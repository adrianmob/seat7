import { updateUser } from './updateUser';
// import { OtherReducer } from './otherReducer';
import { combineReducers } from 'redux';

export const Reducers = combineReducers({
  updateUserInfos: updateUser
});