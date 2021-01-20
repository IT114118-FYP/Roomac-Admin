import React from "react";
import { Box, Grid, TextField, Typography } from "@material-ui/core";
import { useFormikContext } from "formik";

function NewField({ title, name, value, loading, onChange, ...props }) {
	const {
		setFieldTouched,
		setFieldValue,
		errors,
		touched,
		values,
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
					<TextField
						id={name}
						onChange={(text) =>
							setFieldValue(name, text.target.value)
						}
						onBlur={() => setFieldTouched(name)}
						value={values[name]}
						error={touched[name] && errors[name]}
						helperText={touched[name] ? errors[name] : null}
						size="small"
						fullWidth
						variant="outlined"
						{...props}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}

export default NewField;
