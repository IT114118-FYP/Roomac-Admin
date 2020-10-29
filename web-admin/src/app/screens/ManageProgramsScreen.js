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
import * as axios from "axios";

import NavDrawer from "../components/NavDrawer";
import ProgramTable from "../components/programs/ProgramTable";
import SnackbarAlert from "../components/SnackbarAlert";
import ConfirmDialog from "../components/ConfirmDialog";
import { instance } from "../api/auth";

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
		await instance
			.post("/api/programs", {
				id: this.state.newCode,
				title_en: this.state.newEnglishName,
				title_hk: this.state.newChineseName,
				title_cn: this.state.newChineseName,
			})
			.then(function (response) {
				console.log(response);
			})
			.catch(() => {
				this.setState({ addNewError: true });
			});
		this.handleConfirmation();
		this.fetchPrograms();
	};

	render() {
		return (
			<NavDrawer title="Manage Programmes">
				<div>
					<Accordion defaultExpanded>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>View Programmes</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<ProgramTable programs={this.state.programs} />
						</AccordionDetails>
					</Accordion>
					<Accordion>
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
					{`Program Code: ${this.state.newCode}`}
					<p />
					{`English Title: ${this.state.newEnglishName}`}
					<p />
					{`Chinese Title: ${this.state.newChineseName}`}
				</ConfirmDialog>
			</NavDrawer>
		);
	}
}

export default withRouter(ManageProgramsScreen);
