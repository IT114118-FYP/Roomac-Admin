import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	InputLabel,
	makeStyles,
	Tooltip,
} from "@material-ui/core";

const useAddingStyles = makeStyles({
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});

export default function AddingCard({ onAdd }) {
	const classes = useAddingStyles();

	const [isAdding, setAdding] = useState(false);
	const [code, setCode] = useState("");
	const [chiName, setChiName] = useState("");
	const [engName, setEngName] = useState("");
	const [disabled, setDisabled] = useState(false);

	const onAddClick = () => {
		setAdding(true);
		onAdd(code, engName, chiName);
		setDisabled(true);
		setAdding(false);
	};

	return (
		<>
			{disabled && (
				<Tooltip title="This form cannot be edited." arrow>
					<Card>
						<CardContent>
							<Typography
								className={classes.title}
								color="textSecondary"
								gutterBottom
							>
								new program
							</Typography>
							<InputLabel>
								<TextField
									value={code}
									onChange={(event) =>
										setCode(event.target.value)
									}
									label="Code"
									fullWidth
									autoFocus
									disabled={disabled}
								/>
							</InputLabel>
							<InputLabel>
								<TextField
									value={engName}
									onChange={(event) =>
										setEngName(event.target.value)
									}
									label="English Name"
									fullWidth
									disabled={disabled}
								/>
							</InputLabel>
							<InputLabel>
								<TextField
									value={chiName}
									onChange={(event) =>
										setChiName(event.target.value)
									}
									label="Chinese Name"
									fullWidth
									disabled={disabled}
								/>
							</InputLabel>
						</CardContent>
						<CardActions>
							<Button
								size="small"
								color="primary"
								onClick={onAddClick}
								disabled={disabled}
							>
								Add program
							</Button>
							{isAdding && <CircularProgress size={24} />}
						</CardActions>
					</Card>
				</Tooltip>
			)}
			{!disabled && (
				<Card>
					<CardContent>
						<Typography
							className={classes.title}
							color="textSecondary"
							gutterBottom
						>
							new program
						</Typography>
						<InputLabel>
							<TextField
								value={code}
								onChange={(event) =>
									setCode(event.target.value)
								}
								label="Code"
								fullWidth
								autoFocus
								disabled={disabled}
							/>
						</InputLabel>
						<InputLabel>
							<TextField
								value={engName}
								onChange={(event) =>
									setEngName(event.target.value)
								}
								label="English Name"
								fullWidth
								disabled={disabled}
							/>
						</InputLabel>
						<InputLabel>
							<TextField
								value={chiName}
								onChange={(event) =>
									setChiName(event.target.value)
								}
								label="Chinese Name"
								fullWidth
								disabled={disabled}
							/>
						</InputLabel>
					</CardContent>
					<CardActions>
						<Button
							size="small"
							color="primary"
							onClick={onAddClick}
							disabled={disabled}
						>
							Add program
						</Button>
						{isAdding && <CircularProgress size={24} />}
					</CardActions>
				</Card>
			)}
		</>
	);
}
