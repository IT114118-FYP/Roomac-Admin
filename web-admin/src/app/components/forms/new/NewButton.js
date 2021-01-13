import React from "react";
import { useFormikContext } from "formik";
import { Button } from "@material-ui/core";

function NewButton({ title, ...otherProps }) {
	const { handleSubmit } = useFormikContext();

	return (
		<Button onClick={handleSubmit} {...otherProps}>
			{title}
		</Button>
	);
}

export default NewButton;
