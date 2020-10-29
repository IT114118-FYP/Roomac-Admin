import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from "@material-ui/core/AccordionActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { withRouter } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { axiosInstance } from "../api/config";
import NavDrawer from "../components/NavDrawer";
import ProgramTable from "../components/programs/ProgramTable";
import SnackbarAlert from "../components/SnackbarAlert";
import ConfirmDialog from "../components/ConfirmDialog";
import FullscreenProgress from "../components/FullscreenProgress";

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
			newCode: "",
			newEnglishName: "",
			newChineseName: "",
			addNewError: false,
			openConfirmation: false,

			openEditProgram: false,
			editCode: "",
			editEnglishTitle: "",
			editChineseTitle: "",
		};
	}
	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;
		this.fetchPrograms();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	fetchPrograms = () => {
		axiosInstance
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
	};

	handleResetNewProgram = () => {
		this.setState({
			newCode: "",
			newEnglishName: "",
			newChineseName: "",
		});
	};

	handleConfirmation = () => {
		this.setState({
			openConfirmation: !this.state.openConfirmation,
		});
	};

	handleAddNewProgram = async () => {
		this.setState({ isLoading: true, openConfirmation: false });
		await axiosInstance
			.post("/api/programs", {
				id: this.state.newCode,
				title_en: this.state.newEnglishName,
				title_hk: this.state.newChineseName,
				title_cn: this.state.newChineseName,
			})
			.then(() => {
				this.setState({ isLoading: false });
			})
			.catch(() => {
				this.setState({ addNewError: true, isLoading: false });
			});
		this.handleResetNewProgram();
		this.fetchPrograms();
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
		this.fetchPrograms();
	};

	handleDeleteProgram = async () => {
		this.setState({ isLoading: true });
		const codes = JSON.parse(localStorage.getItem("deleteCode"));
		await codes.forEach((code) => {
			axiosInstance
				.delete(`/api/programs/${code}`)
				.then(() => {
					this.setState({ isLoading: false });
				})
				.catch(() => {
					this.setState({ isLoading: false });
				});
		});
		this.fetchPrograms();
	};

	handleOpenEdit = () => {
		const code = localStorage.getItem("editCode");
		const selectedProgram = this.state.programs.find(
			(program) => program.code === code
		);
		this.setState({
			openEditProgram: true,
			editCode: selectedProgram.code,
			editEnglishTitle: selectedProgram.engName,
			editChineseTitle: selectedProgram.chiName,
		});
	};
	handleCloseEdit = () => this.setState({ openEditProgram: false });

	render() {
		return (
			<NavDrawer title="Manage Programmes">
				<div>
					<Accordion defaultExpanded>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel2a-content"
							id="panel2a-header"
						>
							<Typography>Add New Programmes</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Grid container spacing={3}>
								<Grid item xs={3}>
									<TextField
										value={this.state.newCode}
										onChange={(e) =>
											this.setState({
												newCode: e.target.value,
											})
										}
										id="code"
										label="Code"
										style={{
											width: "100%",
										}}
									/>
								</Grid>
								<Grid item xs={3}>
									<TextField
										value={this.state.newEnglishName}
										onChange={(e) =>
											this.setState({
												newEnglishName: e.target.value,
											})
										}
										id="engName"
										label="English Name"
										style={{
											width: "100%",
										}}
									/>
								</Grid>
								<Grid item xs={3}>
									<TextField
										value={this.state.newChineseName}
										onChange={(e) =>
											this.setState({
												newChineseName: e.target.value,
											})
										}
										id="chiName"
										label="Chinese Name"
										style={{
											width: "100%",
										}}
									/>
								</Grid>
							</Grid>
						</AccordionDetails>
						<Divider />
						<AccordionActions>
							<Button
								size="small"
								onClick={this.handleResetNewProgram}
							>
								Clear
							</Button>
							<Button
								size="small"
								color="primary"
								onClick={this.handleConfirmation}
							>
								Add
							</Button>
						</AccordionActions>
					</Accordion>

					<Accordion defaultExpanded>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>View Programmes</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<ProgramTable
								programs={this.state.programs}
								onEditClick={this.handleOpenEdit}
								onDeleteProgram={this.handleDeleteProgram}
							/>
						</AccordionDetails>
					</Accordion>
				</div>

				<SnackbarAlert
					open={this.state.addNewError}
					onClose={() => this.setState({ addNewError: false })}
					alertText="Add Failed! Check all input fields for incorrect values"
					autoHideDuration={3000}
				/>

				<ConfirmDialog
					title="Confirm Details"
					open={this.state.openConfirmation}
					onConfirm={this.handleAddNewProgram}
					onClose={this.handleConfirmation}
				>
					{`Program Code: ${this.state.newCode} \n`}
					{`English Title: ${this.state.newEnglishName} \n`}
					{`Chinese Title: ${this.state.newChineseName}`}
				</ConfirmDialog>

				<FullscreenProgress open={this.state.isLoading} />

				<Dialog
					open={this.state.openEditProgram}
					onClose={this.handleCloseEdit}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">
						Edit Programme
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							To edit this programme, please edit programme code,
							English and Chinese title here. Leave it be if no
							amendments are made.
						</DialogContentText>
						<TextField
							value={this.state.editCode}
							onChange={(text) =>
								this.setState({ editCode: text.target.value })
							}
							autoFocus
							margin="dense"
							id="code"
							label="Programme Code"
							fullWidth
						/>
						<TextField
							value={this.state.editEnglishTitle}
							onChange={(text) =>
								this.setState({
									editEnglishTitle: text.target.value,
								})
							}
							margin="dense"
							id="title_en"
							label="English Title"
							fullWidth
						/>
						<TextField
							value={this.state.editChineseTitle}
							onChange={(text) =>
								this.setState({
									editChineseTitle: text.target.value,
								})
							}
							margin="dense"
							id="title_hk"
							label="Chinese Title"
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleCloseEdit} color="primary">
							Cancel
						</Button>
						<Button
							onClick={this.handleEditProgram}
							color="primary"
						>
							Finish
						</Button>
					</DialogActions>
				</Dialog>
			</NavDrawer>
		);
	}
}

export default withRouter(ManageProgramsScreen);
