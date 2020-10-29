import * as axios from "axios";

const baseURL = "https://it114118-fyp.herokuapp.com";

const instance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: { Authorization: "Bearer " + localStorage.getItem("authToken") },
});

instance.interceptors.request.use(
	async (config) => {
		config.headers = {
			Authorization: "Bearer " + localStorage.getItem("authToken"),
		};
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

export { instance };

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
