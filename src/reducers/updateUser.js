import { UPDATE_LOGED_USER } from '../actions/actionTypes';

const initialState = {
	active: '',
	logo_user: '',
  name: '',
  email: '',
  company: '',
  user_id: '',
  user_type: '',
	newProjects: "",
	clientRequest: "",
};

export const updateUser = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOGED_USER:
      return {
        ...state,
        active: action.active,
        logo_user: action.logo_user,
        name: action.name,
        email: action.email,
        company: action.company,
        user_id: action.user_id,
        user_type: action.user_type,
        newProjects: action.newProjects,
        clientRequest: action.clientRequest
      };
    default:
      return state;
  }
};