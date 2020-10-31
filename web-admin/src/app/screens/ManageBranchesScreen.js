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

import NavDrawer from "../components/NavDrawer";
import { axiosInstance } from "../api/config";
import SnackbarAlert from "../components/SnackbarAlert";
import ConfirmDialog from "../components/ConfirmDialog";
import FullscreenProgress from "../components/FullscreenProgress";
import DataTable from "../components/DataTable";

function createData(id, title_en, title_hk, title_cn) {
	return { id, title_en, title_hk, title_cn };
}

const branchHeadCells = [
	{
		id: "id",
		numeric: false,
		disablePadding: true,
		label: "Branch ID",
	},
	{
		id: "title_en",
		numeric: false,
		disablePadding: false,
		label: "English Name",
	},
	{
		id: "title_hk",
		numeric: false,
		disablePadding: false,
		label: "Chinese Name (traditional)",
	},
	{
		id: "title_cn",
		numeric: false,
		disablePadding: false,
		label: "Chinese Name (simplified)",
	},
];

class ManageBranchesScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			rawBranches: [],
			branches: [],

			newID: "",
			newEnglishName: "",
			newChineseName: "",
			addNewError: false,
			openConfirmation: false,

			openEdit: false,
			editID: "",
			editEnglishTitle: "",
			editChineseTitle: "",
		};
	}
	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;
		this.fetchBranches();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	fetchBranches = () => {
		axiosInstance
			.get("/api/branches")
			.then((response) => {
				this.setState({
					rawBranches: response.data,
					isLoading: false,
				});

				var newBranches = [];
				for (let i = 0; i < this.state.rawBranches.length; i++) {
					newBranches.push(
						createData(
							this.state.rawBranches[i].id,
							this.state.rawBranches[i].title_en,
							this.state.rawBranches[i].title_hk,
							this.state.rawBranches[i].title_cn
						)
					);
				}
				this.setState({
					branches: newBranches,
				});
			})
			.catch(() => {
				this.setState({ isLoading: false });
			});
	};

	handleResetAdd = () => {
		this.setState({
			newID: "",
			newEnglishName: "",
			newChineseName: "",
		});
	};

	handleConfirmation = () => {
		this.setState({
			openConfirmation: !this.state.openConfirmation,
		});
	};

	handleAddNewBranch = async () => {
		this.setState({ isLoading: true, openConfirmation: false });
		await axiosInstance
			.post("/api/branches", {
				id: this.state.newID,
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
		this.handleResetAdd();
		this.fetchBranches();
	};

	handleEdit = async () => {
		this.setState({ isLoading: true, openEdit: false });
		await axiosInstance
			.patch(`/api/branches/${this.state.editID}`, {
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
		this.fetchBranches();
	};

	handleDelete = async () => {
		this.setState({ isLoading: true });
		const branches = JSON.parse(localStorage.getItem("deleteBranch"));
		await axiosInstance
			.delete("/api/branches", {
				// use either one
				// ids: ["CW"],
				ids: branches,
			})
			.catch((error) => console.log(error));
		localStorage.removeItem("deleteBranch");
		this.setState({ isLoading: false });
		this.fetchBranches();

		// This still Works
		// branches.forEach(async (branch) => {
		// 	await axiosInstance
		// 		.delete(`/api/branches/${branch}`)
		// 		.then(() => {
		// 			this.setState({ isLoading: false });
		// 		})
		// 		.catch(() => {
		// 			this.setState({ isLoading: false });
		// 		});
		// 	localStorage.removeItem("deleteBranch");
		// 	this.setState({ isLoading: false });
		// 	this.fetchBranches();
		// });
	};

	handleOpenEdit = () => {
		const branchID = localStorage.getItem("editBranch");
		const selected = this.state.branches.find(
			(branch) => branch.id === branchID
		);
		this.setState({
			openEdit: true,
			editID: selected.id,
			editEnglishTitle: selected.title_en,
			editChineseTitle: selected.title_hk,
		});
	};

	handleCloseEdit = () => {
		this.setState({ openEdit: false });
		localStorage.removeItem("editBranch");
	};

	render() {
		return (
			<NavDrawer title="Manage Branches">
				<div>
					<Accordion defaultExpanded>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel2a-content"
							id="panel2a-header"
						>
							<Typography>Add New Branch</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Grid container spacing={3}>
								<Grid item xs={3}>
									<TextField
										value={this.state.newID}
										onChange={(e) =>
											this.setState({
												newID: e.target.value,
											})
										}
										id="id"
										label="ID"
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
							<Button size="small" onClick={this.handleResetAdd}>
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
							<Typography>View Branches</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<DataTable
								title="Branches"
								editTag="editBranch"
								deleteTag="deleteBranch"
								headCells={branchHeadCells}
								data={this.state.branches}
								onEdit={this.handleOpenEdit}
								onDelete={this.handleDelete}
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
					onConfirm={this.handleAddNewBranch}
					onClose={this.handleConfirmation}
				>
					{`Branch ID: ${this.state.newID}, `}
					{`${this.state.newEnglishName}, `}
					{`${this.state.newChineseName}`}
				</ConfirmDialog>

				<FullscreenProgress open={this.state.isLoading} />

				<Dialog
					open={this.state.openEdit}
					onClose={this.handleCloseEdit}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">
						Edit Branch
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							To edit this branch, please edit branch id, English
							and Chinese title here. Leave it be if no amendments
							are made.
						</DialogContentText>
						<TextField
							value={this.state.editID}
							disabled
							margin="dense"
							id="id"
							label="Branch ID"
							fullWidth
						/>
						<TextField
							value={this.state.editEnglishTitle}
							onChange={(text) =>
								this.setState({
									editEnglishTitle: text.target.value,
								})
							}
							autoFocus
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
						<Button onClick={this.handleEdit} color="primary">
							Finish
						</Button>
					</DialogActions>
				</Dialog>
			</NavDrawer>
		);
	}
}

export default withRouter(ManageBranchesScreen);
