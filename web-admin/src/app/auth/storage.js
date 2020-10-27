const AUTH_TOKEN = "authToken";

export const storeToken = (token) => {
	localStorage.setItem(AUTH_TOKEN, token);
};

export const getToken = () => {
	return localStorage.getItem(AUTH_TOKEN);
};

export const removeToken = () => {
	localStorage.removeItem(AUTH_TOKEN);
};
