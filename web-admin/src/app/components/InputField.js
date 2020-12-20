import React, { useState } from "react";
import { InputLabel, TextField } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

function InputField(props) {
	const [value, setValue] = useState("");

	const handleChange = (event) => setValue(event.target.value);

	return (
		<>
			{props.loading ? (
				<Skeleton height={57} animation="wave" variant="text" />
			) : (
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
			)}
		</>
	);
}

export default InputField;
