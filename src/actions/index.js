import { UPDATE_LOGED_USER } from './actionTypes';

export const loadInfos = (active, logo_user, name, email, company, user_id, user_type, newProjects, clientRequest) => ({
  type: UPDATE_LOGED_USER,
	active: active,
	logo_user: logo_user,
  name: name,
  email: email,
  company: company,
  user_id: user_id,
  user_type: user_type,
  newProjects: newProjects,
  clientRequest: clientRequest
});