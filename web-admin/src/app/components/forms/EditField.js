import React, { useState } from "react";
import {
	Box,
	Grid,
	IconButton,
	TextField,
	Typography,
	Select,
	MenuItem,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import EditIcon from "@material-ui/icons/Edit";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";

function EditField({
	name,
	value,
	loading,
	onSave,
	picker = false,
	pickerItem,
}) {
	const [textValue, setTextValue] = useState(value);
	const [pickerValue, setPickerValue] = useState(value);
	const [edit, setEdit] = useState(false);
	const [changed, setChanged] = useState(false);

	const onEdit = () => {
		setEdit(true);
		setTextValue(value);
	};

	const onClose = () => {
		setTextValue(value);
		setEdit(false);
	};

	const onFinish = () => {
		// onSva("asd");
		setEdit(false);
		onSave(textValue);
		onClose();
	};

	const handleChange = (event) => {
		setTextValue(event.target.value);
		if (event.target.value != value) {
			setChanged(true);
		}
	};

	const handlePickerChange = (event) => {
		setPickerValue(event.target.value);
	};

	return (
		<Box paddingY={2}>
			<Grid container spacing={1}>
				<Grid item xs={3}>
					<Typography
						variant="caption"
						color="textSecondary"
						style={{
							overflow: "hidden",
						}}
					>
						{name.toUpperCase()}
					</Typography>
				</Grid>
				<Grid item xs={7}>
					{edit ? (
						picker ? (
							<Select
								fullWidth
								value={pickerValue}
								onChange={handlePickerChange}
							>
								{pickerItem.map((item) => (
									<MenuItem value={item.id}>
										{item.title_en}
									</MenuItem>
								))}
							</Select>
						) : (
							<TextField
								value={textValue}
								autoFocus
								fullWidth
								onChange={handleChange}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										onFinish();
									}
								}}
							/>
						)
					) : (
						<Typography>
							{loading ? <Skeleton /> : value}
						</Typography>
					)}
				</Grid>
				<Grid item xs={2}>
					{edit ? (
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
					)}
				</Grid>
			</Grid>
		</Box>
	);
}

export default EditField;