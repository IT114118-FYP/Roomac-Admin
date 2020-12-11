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
import { withRouter } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
	CircularProgress,
	LinearProgress,
	MenuItem,
	Select,
} from "@material-ui/core";
import download from "downloadjs";

import NavDrawer from "../components/NavDrawer";
import { axiosInstance } from "../api/config";
import SnackbarAlert from "../components/SnackbarAlert";
import ConfirmDialog from "../components/ConfirmDialog";
import FullscreenProgress from "../components/FullscreenProgress";
import DataTable from "../components/DataTable";
import InputField from "../components/InputField";
import ViewBranches from "../components/branches/ViewBranches";

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

class ManageBranchesPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			isTableLoading: false,
			isExportLoading: false,
			rawBranches: [],
			branches: [],

			searchTag: branchHeadCells[0].id,

			newID: "",
			newEnglishName: "",
			newChineseName: "",
			openConfirmation: false,

			addNewError: false,
			addNewSuccess: false,
			deleteSuccess: false,
			deleteFailed: false,

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
		this.setState({ isTableLoading: true });
		axiosInstance
			.get("/api/branches")
			.then((response) => {
				this.setState({
					rawBranches: response.data,
					isTableLoading: false,
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
				this.setState({ isTableLoading: false });
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
				this.setState({ addNewSuccess: true, isLoading: false });
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

	handleDelete = () => {
		this.setState({ isLoading: true });
		let branches = JSON.parse(localStorage.getItem("deleteBranch"));
		localStorage.removeItem("deleteBranch");
		axiosInstance
			.delete("/api/branches", { data: { ids: branches } })
			.then(() => {
				this.setState({ deleteSuccess: true, isLoading: false });
				this.fetchBranches();
			})
			.catch((errors) => {
				this.setState({ deleteFailed: true, isLoading: false });
			});
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

	handleExport = () => {
		this.setState({ isExportLoading: true });
		axiosInstance
			.get("/api/branches/export", {
				headers: "Content-type: application/vnd.ms-excel",
				responseType: "blob",
			})
			.then((response) => {
				download(
					new Blob([response.data]),
					"branches.xlsx",
					"application/vnd.ms-excel"
				);
				this.setState({ isExportLoading: false });
			})
			.catch(() => {
				this.setState({ isExportLoading: false });
			});
		this.fetchBranches();
	};

	SearchBranch(props) {
		return (
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="search-branch"
					id="search-branch"
				>
					<Typography>Search</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Select
						value={props.searchValue}
						onChange={props.onSearchChange}
					>
						{branchHeadCells.map(({ id, label }) => (
							<MenuItem key={id} value={id}>
								{label}
							</MenuItem>
						))}
					</Select>
					<TextField
						fullWidth
						id="searchField"
						label="Enter Search"
						type="search"
					/>
				</AccordionDetails>
				<Divider />
				<AccordionActions>
					<Button size="small" onClick={props.onSearch}>
						Clear
					</Button>
					<Button
						size="small"
						color="primary"
						onClick={props.onReset}
					>
						Search
					</Button>
				</AccordionActions>
			</Accordion>
		);
	}

	ViewBranches(props) {
		return (
			<Accordion defaultExpanded>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="view-branches"
					id="view-branches"
				>
					<Typography>View Programmes</Typography>
				</AccordionSummary>
				{props.isTableLoading && <LinearProgress />}
				<AccordionDetails>
					<DataTable
						title="Branches"
						editTag="editBranch"
						deleteTag="deleteBranch"
						headCells={branchHeadCells}
						data={props.data}
						onEdit={props.onEdit}
						onDelete={props.onDelete}
						onRefresh={props.onRefresh}
					/>
				</AccordionDetails>

				<AccordionActions>
					{props.isExportLoading && <CircularProgress size={24} />}
					<Button
						size="small"
						color="primary"
						onClick={props.onExport}
					>
						Export Branches
					</Button>
				</AccordionActions>
			</Accordion>
		);
	}

	AddBranches(props) {
		return (
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="add-branches"
					id="add-branches"
				>
					<Typography>Add New Branch</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<InputField
						onBlur={props.onBlurID}
						id="id"
						label="ID"
						fullWidth
					/>
					<InputField
						onBlur={props.onBlurEnglish}
						id="engName"
						label="English Name"
						fullWidth
					/>
					<InputField
						onBlur={props.onBlurChinese}
						id="chiName"
						label="Chinese Name"
						fullWidth
					/>
				</AccordionDetails>
				<Divider />
				<AccordionActions>
					<Button size="small" onClick={props.onClear}>
						Clear
					</Button>
					<Button size="small" color="primary" onClick={props.onAdd}>
						Add
					</Button>
				</AccordionActions>
			</Accordion>
		);
	}

	render() {
		return (
			<NavDrawer title="Manage Branches">
				<div>
					{/* <this.SearchBranch
						searchValue={this.state.searchTag}
						onSearchChange={(e) => {
							this.setState({
								searchTag: e.target.value,
							});
						}}
						onSearch={this.handleConfirmation}
						onReset={this.handleResetAdd}
					/> */}

					{/* <this.ViewBranches
						data={this.state.branches}
						onEdit={this.handleEdit}
						onDelete={this.handleDelete}
						onExport={this.handleExport}
						onRefresh={this.fetchBranches}
						isExportLoading={this.state.isExportLoading}
						isTableLoading={this.state.isTableLoading}
					/> */}

					<ViewBranches />

					<this.AddBranches
						onBlurID={(e) =>
							this.setState({ newID: e.target.value })
						}
						onBlurEnglish={(e) =>
							this.setState({ newEnglishName: e.target.value })
						}
						onBlurChinese={(e) =>
							this.setState({ newChineseName: e.target.value })
						}
						// onUpload={(e) =>
						// 	this.setState({ newCode: e.target.value })
						// }
						onAdd={this.handleConfirmation}
						onReset={this.handleResetAdd}
					/>
				</div>

				<SnackbarAlert
					open={this.state.addNewError}
					onClose={() => this.setState({ addNewError: false })}
					alertText="Add Failed! Check all input fields for incorrect values"
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

export default withRouter(ManageBranchesPage);
