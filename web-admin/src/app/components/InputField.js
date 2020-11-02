import React, { useState } from "react";
import { InputLabel, TextField } from "@material-ui/core";

function InputField(props) {
	const [value, setValue] = useState("");

	const handleChange = (event) => setValue(event.target.value);

	return (
		<InputLabel>
			<TextField
				value={value}
				onChange={handleChange}
				onBlur={props.onBlur}
				id={props.id}
				label={props.label}
				fullWidth
				{...props}
			/>
		</InputLabel>
	);
}

export default InputField;
