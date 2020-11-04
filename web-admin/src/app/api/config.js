import * as axios from "axios";
import algoliasearch from "algoliasearch/lite";

const baseURL = "https://it114118-fyp.herokuapp.com";

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
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

const searchClient = algoliasearch(
	"HHSMHILUC5",
	"eb44f910d1d0b165dc5a8fadfdd59523"
);

const searchIndexName = {
	PROGRAM: "programs",
	USER: "users",
	BRANCH: "branches",
	VENUE: "venues",
};

export { axiosInstance, searchClient, searchIndexName };
