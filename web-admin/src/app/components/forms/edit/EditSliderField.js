import React, { useState } from "react";
import {
	Box,
	Grid,
	IconButton,
	Slider,
	TextField,
	Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import EditIcon from "@material-ui/icons/Edit";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";

function EditSliderField({ name, value, loading, onSave, editable = true }) {
	const [textValue, setTextValue] = useState(value);
	const [edit, setEdit] = useState(false);

	const onEdit = () => {
		setEdit(true);
		setTextValue(value);
	};

	const onClose = () => {
		setTextValue(value);
		setEdit(false);
	};

	const onFinish = () => {
		console.log(textValue);
		setEdit(false);
		onSave(textValue);
		onClose();
	};

	const handleChange = (event, newValue) => {
		setTextValue(newValue);
	};

	return (
		<Box paddingY={2}>
			<Grid container spacing={1}>
				<Grid item xs={3}>
					<Typography variant="caption" color="textSecondary">
						{name.toUpperCase()}
					</Typography>
				</Grid>
				<Grid item xs={7}>
					{edit ? (
						<Slider
							autoFocus
							value={textValue}
							onChange={handleChange}
							valueLabelDisplay="auto"
							// aria-labelledby="range-slider"
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									onFinish();
								}
							}}
							// getAriaValueText={valuetext}
						/>
					) : (
						<Typography>
							{loading ? (
								<Skeleton />
							) : (
								`${value[0]} - ${value[1]}`
							)}
						</Typography>
					)}
				</Grid>
				<Grid item xs={2}>
					{editable &&
						(edit ? (
							<>
								<IconButton onClick={onClose} size="small">
									<ClearIcon color="action" />
								</IconButton>
								<IconButton onClick={onFinish} size="small">
									<DoneIcon color="action" />
								</IconButton>
							</>
						) : (
							!loading && (
								<>
									<IconButton onClick={onEdit} size="small">
										<EditIcon color="action" />
									</IconButton>
								</>
							)
						))}
				</Grid>
			</Grid>
		</Box>
	);
}

export default EditSliderField;
