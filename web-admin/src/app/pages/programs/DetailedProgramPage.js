import { Box, Breadcrumbs, Divider, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { axiosInstance } from "../../api/config";
import EditField from "../../components/forms/edit/EditField";
import EditForm from "../../components/forms/edit/EditForm";
import NavDrawer from "../../components/NavDrawer";
import routes from "../../navigation/routes";

function DetailedProgramPage({ match }) {
	const [isLoading, setLoading] = useState(true);
	const [program, setProgram] = useState({});
	const [error, setError] = useState(false);

	useEffect(() => {
		fetchProgram();
	}, []);

	const fetchProgram = () => {
		setLoading(true);
		axiosInstance
			.get(`api/programs/${match.params.id}`)
			.then(({ data }) => {
				setProgram(data);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setError(true);
			});
	};

	const updateProgram = (name, value) => {
		setLoading(true);
		axiosInstance
			.put(`api/programs/${match.params.id}`, {
				id: name == "id" ? value : program.id,
				title_en: name == "title_en" ? value : program.title_en,
				title_hk: name == "title_hk" ? value : program.title_hk,
				title_cn: name == "title_cn" ? value : program.title_cn,
			})
			.then(() => {
				fetchProgram();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<NavDrawer>
			<Breadcrumbs aria-label="breadcrumb">
				<Link to={routes.programs.MANAGE}>programs</Link>
				<Typography color="textPrimary">details</Typography>
			</Breadcrumbs>
			{error ? (
				<Box
					alignItems="center"
					justifyContent="center"
					display="flex"
					flexDirection="column"
				>
					<Typography variant="h6">Programme Not Found...</Typography>
					<Link to={routes.programs.MANAGE}>go back</Link>
				</Box>
			) : (
				<div>
					<Box marginBottom={2} marginTop={3}>
						<Typography
							variant="h5"
							component="div"
							style={{
								fontWeight: "bold",
							}}
						>
							{isLoading ? <Skeleton /> : `${program.title_en}`}
						</Typography>
						<Typography
							variant="h6"
							component="div"
							color="textSecondary"
						>
							{isLoading ? (
								<Skeleton />
							) : (
								`Programme Code ${program.id}`
							)}
						</Typography>
					</Box>
					<EditForm title="Prgramme info">
						<EditField
							loading={isLoading}
							name="programme code"
							value={program.id}
							onSave={(newValue) => updateProgram("id", newValue)}
						/>
						<Divider />
						<EditField
							loading={isLoading}
							name="English"
							value={program.title_en}
							onSave={(newValue) =>
								updateProgram("title_en", newValue)
							}
						/>
						<Divider />
						<EditField
							loading={isLoading}
							name="Chinese (traditional)"
							value={program.title_hk}
							onSave={(newValue) =>
								updateProgram("title_hk", newValue)
							}
						/>
						<Divider />
						<EditField
							loading={isLoading}
							name="Chinese (simplified)"
							value={program.title_cn}
							onSave={(newValue) =>
								updateProgram("title_cn", newValue)
							}
						/>
					</EditForm>
				</div>
			)}
		</NavDrawer>
	);
}

export default DetailedProgramPage;
