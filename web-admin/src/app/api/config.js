import * as axios from "axios";

const baseURL = "https://roomac.tatlead.com";
const baseURL1 = "https://it114118-fyp.herokuapp.com";
var counter = 0;

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: { Authorization: "Bearer " + localStorage.getItem("authToken") },
});

axiosInstance.interceptors.request.use(
	async (config) => {
		config.headers = {
			Authorization: "Bearer " + localStorage.getItem("authToken"),
		};

		// console.log(`config run ${++counter} time`);
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);
export { axiosInstance };
