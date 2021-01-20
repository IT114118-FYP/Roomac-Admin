import React, { useState } from "react";
import {
	Box,
	Grid,
	IconButton,
	Typography,
	Select,
	MenuItem,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import EditIcon from "@material-ui/icons/Edit";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";

// pickerItem format must be in the following: [{
//      id: ...,
//      value: ...
// }]

export const createPickerValue = (id, value) => {
	return { id: id, value: value };
};

function EditPickerField({ name, value, loading, onSave, pickerItem }) {
	const [pickerValue, setPickerValue] = useState(value);
	const [edit, setEdit] = useState(false);

	const onEdit = () => {
		setEdit(true);
		setPickerValue(value);
	};

	const onClose = () => {
		setPickerValue(value);
		setEdit(false);
	};

	const onFinish = () => {
		setEdit(false);
		onSave(pickerValue);
		onClose();
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
						<Select
							fullWidth
							value={pickerValue}
							onChange={handlePickerChange}
						>
							{pickerItem.map((item) => (
								<MenuItem value={item.id} key={item.id}>
									{item.value}
								</MenuItem>
							))}
						</Select>
					) : (
						<Typography>
							{loading ? (
								<Skeleton />
							) : (
								pickerItem.find((item) => item.id === value)
									.value
							)}
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

export default EditPickerField;
