import api from "./api";

export const TOKEN_KEY = "@seat7-Token";
export const USER_ID = "@user_id";
export const USER_TYPE = "user_type";
export const TC = "token_created";
export const TE = "token_expiration";

export const isAuthenticated = () => {
	const token = localStorage.getItem(TOKEN_KEY);

	if(token !== null) {
		const tc = localStorage.getItem(TC);
		const te = parseInt(localStorage.getItem(TE));

		const now = new Date();
		let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
		utc = utc.getFullYear() +"-"+
					(utc.getMonth()+1 <= 9 ? "0" : "") + (utc.getMonth()+1) +"-"+
					(utc.getDate() <= 9 ? "0" : "") + utc.getDate() +"T"+
					(utc.getHours() <= 9 ? "0" : "") + utc.getHours() +":"+
					(utc.getMinutes() <= 9 ? "0" : "") + utc.getMinutes() +":"+
					(utc.getSeconds() <= 9 ? "0" : "") + utc.getSeconds() +"."+
					utc.getMilliseconds() + "z";

		utc = utc.toString();

		const newTC = Date.parse(tc);
		const newUTC = Date.parse(utc);
		const seconds = parseInt((((newUTC - newTC) / 1000)));

		if(seconds > te){
			logout();
			return false;
		} else {
			return true;
		}
	}
	else{
		return false;
	}
}


export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUserId = () => localStorage.getItem(USER_ID);
export const getUserType = () => localStorage.getItem(USER_TYPE);

export const login = (token, id, created, expiration) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID, id);
  localStorage.setItem(TC, created);
  localStorage.setItem(TE, expiration);
};

export const logout = async () => {
	try {
		console.log('logout');
		await api.post(`app_users/logout`);
		await localStorage.removeItem(USER_TYPE);
		await localStorage.removeItem(TOKEN_KEY);
		await localStorage.removeItem(TC);
		await localStorage.removeItem(TE);
		await localStorage.removeItem(USER_ID);
		return true;
	} catch (error) {
		await localStorage.removeItem(USER_TYPE);
		await localStorage.removeItem(TOKEN_KEY);
		await localStorage.removeItem(TC);
		await localStorage.removeItem(TE);
		await localStorage.removeItem(USER_ID);
		return true;
	}
};