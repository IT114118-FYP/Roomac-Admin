import { axiosInstance } from "./config";

export async function submitLogin(id, password) {
	const response = await axiosInstance
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
