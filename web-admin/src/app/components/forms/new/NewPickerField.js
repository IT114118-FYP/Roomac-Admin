import React, { useState } from "react";
import {
	Box,
	Grid,
	IconButton,
	TextField,
	Typography,
	Select,
	MenuItem,
	FormHelperText,
	FormControl,
} from "@material-ui/core";
import { useFormikContext } from "formik";

// pickerItem format must be in the following: [{
//      id: ...,
//      value: ...
// }]

export const createNewPickerValue = (id, value) => {
	return { id: id, value, value };
};

function NewPickerField({ title, name, value, pickerItem, ...props }) {
	const {
		setFieldTouched,
		setFieldValue,
		errors,
		touched,
		values,
		handleSubmit,
	} = useFormikContext();

	return (
		<Box paddingY={2}>
			<Grid container spacing={1}>
				<Grid item xs={4}>
					<Typography variant="caption" color="textSecondary">
						{title}
					</Typography>
				</Grid>
				<Grid item xs={8}>
					<FormControl
						error={touched[name] && errors[name]}
						fullWidth
						size="small"
					>
						<Select
							id={name}
							variant="outlined"
							fullWidth
							onChange={(event) =>
								setFieldValue(name, event.target.value)
							}
							onBlur={() => setFieldTouched(name)}
							error={touched[name] && errors[name]}
							value={values[name]}
							helpertext={touched[name] ? errors[name] : null}
							{...props}
						>
							{pickerItem.map((item) => (
								<MenuItem value={item.id} key={item.id}>
									{item.value}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>
							{touched[name] ? errors[name] : null}
						</FormHelperText>
					</FormControl>
				</Grid>
			</Grid>
		</Box>
	);
}

export default NewPickerField;
