import React from "react";
import NavDrawer from "../components/NavDrawer";
import ProgramTable from "../components/ProgramTable";

import * as axios from "axios";
const baseURL = "http://it114118-fyp.herokuapp.com";

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

function createData(code, engName, chiName, cnName) {
	return { code, engName, chiName, cnName };
}

class ManageProgramsScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			rawPrograms: [],
			programs: [],
		};
	}
	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;

		instance
			.get("/api/programs")
			.then((response) => {
				this.setState({
					rawPrograms: response.data,
					isLoading: false,
				});

				var newPro = [];
				for (let i = 0; i < this.state.rawPrograms.length; i++) {
					newPro.push(
						createData(
							this.state.rawPrograms[i].id,
							this.state.rawPrograms[i].title_en,
							this.state.rawPrograms[i].title_hk,
							this.state.rawPrograms[i].title_cn
						)
					);
				}
				this.setState({
					programs: newPro,
				});
			})
			.catch(() => {
				this.setState({ loading: false });
			});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		return (
			<NavDrawer title="Manage Programmes">
				<ProgramTable programs={this.state.programs} />
			</NavDrawer>
		);
	}
}

export default ManageProgramsScreen;
