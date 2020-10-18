import React from "react";
import { useFormikContext } from "formik";
import { InputLabel, TextField } from "@material-ui/core";

function LoginField({ name, ...otherProps }) {
	const {
		setFieldTouched,
		setFieldValue,
		errors,
		touched,
		values,
	} = useFormikContext();

	return (
		<InputLabel>
			<TextField
				variant="outlined"
				id={name}
				label={name}
				onChange={(text) => setFieldValue(name, text.target.value)}
				onBlur={() => setFieldTouched(name)}
				value={values[name]}
				error={touched[name] && errors[name]}
				helperText={touched[name] ? errors[name] : null}
				{...otherProps}
			/>
		</InputLabel>
	);
}

export default LoginField;
