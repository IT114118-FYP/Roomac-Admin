import * as axios from "axios";
import { getToken } from "../auth/storage";

const baseURL = "http://it114118-fyp.herokuapp.com";

const instance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	// headers: { Authorization: "Bearer " + getToken },
});

// instance.interceptors.request.use(
// 	async (config) => {
// 		const token = getToken;
// 		config.headers = {
// 			Authorization: "Bearer " + token,
// 		};
// 		return config;
// 	},
// 	(error) => {
// 		Promise.reject(error);
// 	}
// );

export async function submitLogin(id, password) {
	const response = await instance
		.post("/api/login", {
			email: id,
			password: password,
			device_name: "admin pc",
		})
		.catch(function (error) {
			console.log("submitLogin Error: " + error);
		});

	// will return authToken (string)
	return response == null ? null : response.data;
}

export async function fetchUser() {
	await instance
		.get("/api/user/me")
		.then(function (response) {
			console.log(response.data.name);
			return true;
		})
		.catch(function (error) {
			console.log(error);
			return false;
		});
}
