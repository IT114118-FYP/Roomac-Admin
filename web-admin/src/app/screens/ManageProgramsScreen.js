import React from "react";
import { withRouter } from "react-router-dom";
import download from "downloadjs";

import { axiosInstance } from "../api/config";
import NavDrawer from "../components/NavDrawer";
import SnackbarAlert from "../components/SnackbarAlert";
import FullscreenProgress from "../components/FullscreenProgress";
import ViewPrograms from "../components/programs/ViewPrograms";
import AddPrograms from "../components/programs/AddPrograms";
import SearchPrograms from "../components/programs/SearchPrograms";
import EditProgramDialog from "../components/programs/EditProgramDialog";
import { Button } from "@material-ui/core";

function createData(id, engName, chiName, cnName) {
	return { id, engName, chiName, cnName };
}

class ManageProgramsScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,

			addNewError: false,
			addNewSuccess: false,
			deleteSuccess: false,
			deleteFailed: false,

			openEditProgram: false,
			editCode: "",
			editEnglishTitle: "",
			editChineseTitle: "",

			file: null,
		};
	}
	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;
		this.fetchPrograms();

		console.log(this.state.rawPrograms);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	fetchPrograms = () => {
		this.setState({ isTableLoading: true });
		axiosInstance
			.get("/api/programs")
			.then((response) => {
				this.setState({
					rawPrograms: response.data,
					isTableLoading: false,
				});
				// var newPro = [];
				// for (let i = 0; i < this.state.rawPrograms.length; i++) {
				// 	newPro.push(
				// 		createData(
				// 			this.state.rawPrograms[i].id,
				// 			this.state.rawPrograms[i].title_en,
				// 			this.state.rawPrograms[i].title_hk,
				// 			this.state.rawPrograms[i].title_cn
				// 		)
				// 	);
				// }
				// this.setState({ programs: newPro });
			})
			.catch(() => {
				this.setState({ isTableLoading: false });
			});
	};

	handleAddNewProgram = async (code, eng, chi) => {
		this.setState({ isLoading: true, openConfirmation: false });
		if (this.state.file != null) {
			const body = new FormData();
			body.append("file", this.state.file);
			await axiosInstance
				.post("/api/programs/import", body)
				.then(() => {
					this.setState({ isLoading: false });
				})
				.catch(() => {
					this.setState({ addNewError: true, isLoading: false });
				});
		} else {
			await axiosInstance
				.post("/api/programs", {
					id: code,
					title_en: eng,
					title_hk: chi,
					title_cn: chi,
				})
				.then(() => {
					this.setState({ addNewSuccess: true, isLoading: false });
				})
				.catch(() => {
					this.setState({ addNewError: true, isLoading: false });
				});
		}
		this.fetchPrograms();
	};

	handleOpenEdit = () => {
		const id = localStorage.getItem("editCode");
		const selectedProgram = this.state.programs.find(
			(program) => program.id === id
		);
		this.setState({
			openEditProgram: true,
			editCode: selectedProgram.id,
			editEnglishTitle: selectedProgram.engName,
			editChineseTitle: selectedProgram.chiName,
		});
	};

	handleCloseEdit = () => {
		this.setState({ openEditProgram: false });
		localStorage.removeItem("editCode");
	};

	handleEditProgram = async () => {
		this.setState({ isLoading: true, openEditProgram: false });
		await axiosInstance
			.patch(`/api/programs/${this.state.editCode}`, {
				title_en: this.state.editEnglishTitle,
				title_hk: this.state.editChineseTitle,
				title_cn: this.state.editChineseTitle,
			})
			.then(() => {
				this.setState({ isLoading: false });
			})
			.catch(() => {
				this.setState({ addNewError: true, isLoading: false });
			});
		localStorage.removeItem("editCode");
		this.fetchPrograms();
	};

	handleDeleteProgram = () => {
		this.setState({ isLoading: true });
		let programCodes = JSON.parse(localStorage.getItem("deleteCode"));
		localStorage.removeItem("deleteBranch");
		axiosInstance
			.delete("/api/programs", { data: { ids: programCodes } })
			.then(() => {
				this.setState({ deleteSuccess: true, isLoading: false });
				this.fetchPrograms();
			})
			.catch(() => {
				this.setState({ deleteFailed: true, isLoading: false });
			});
	};

	handleExportProgram = () => {
		this.setState({ isExportLoading: true });
		axiosInstance
			.get("/api/programs/export", {
				headers: "Content-type: application/vnd.ms-excel",
				responseType: "blob",
			})
			.then((response) => {
				download(
					new Blob([response.data]),
					"programmes.xlsx",
					"application/vnd.ms-excel"
				);
				this.setState({ isExportLoading: false });
			})
			.catch(() => {
				this.setState({ isExportLoading: false });
			});
		this.fetchPrograms();
	};

	handleFileChange = (event) => this.setState({ file: event.target.value });

	render() {
		return (
			<NavDrawer title="Manage Programmes">
				<div>
					{/* <SearchPrograms
						searchValue={this.state.searchTag}
						onSearchChange={(e) => {
							this.setState({
								searchTag: e.target.value,
							});
						}}
						onReset={this.handleResetAdd}
					/> */}
					<ViewPrograms />
					<AddPrograms
						onReset={this.handleResetNewProgram}
						onAdd={(code, eng, chi) => {
							this.handleAddNewProgram(code, eng, chi);
						}}
					/>
				</div>

				<SnackbarAlert
					open={this.state.addNewError}
					onClose={() => this.setState({ addNewError: false })}
					alertText="Add Failed! Check all input fields for incorrect values"
					severity="error"
					autoHideDuration={3000}
				/>

				<SnackbarAlert
					open={this.state.addNewSuccess}
					onClose={() => this.setState({ addNewSuccess: false })}
					alertText="Add Success"
					severity="success"
					autoHideDuration={3000}
				/>

				<SnackbarAlert
					open={this.state.deleteSuccess}
					onClose={() => this.setState({ deleteSuccess: false })}
					alertText="Delete Success"
					severity="success"
					autoHideDuration={3000}
				/>

				<SnackbarAlert
					open={this.state.deleteFailed}
					onClose={() => this.setState({ deleteFailed: false })}
					alertText="Delete Failed"
					severity="error"
					autoHideDuration={3000}
				/>

				<FullscreenProgress open={this.state.isLoading} />

				<EditProgramDialog
					open={this.state.openEditProgram}
					onFinish={this.handleEditProgram}
					onClose={this.handleCloseEdit}
					code={this.state.editCode}
					englishTitle={this.state.editEnglishTitle}
					setEnglishTitle={(text) =>
						this.setState({
							editEnglishTitle: text.target.value,
						})
					}
					chineseTitle={this.state.editChineseTitle}
					setChineseTitle={(text) =>
						this.setState({
							editChineseTitle: text.target.value,
						})
					}
				/>
			</NavDrawer>
		);
	}
}

export default withRouter(ManageProgramsScreen);
