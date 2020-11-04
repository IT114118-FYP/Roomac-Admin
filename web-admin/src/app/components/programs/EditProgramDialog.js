import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	Tooltip,
} from "@material-ui/core";
import React from "react";

// TODO use useState hook instead to prevent excessive rendering
function EditProgramDialog({
	open,
	onFinish,
	onClose,
	code,
	englishTitle,
	setEnglishTitle,
	chineseTitle,
	setChineseTitle,
}) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="form-dialog-title">Edit Programme</DialogTitle>
			<DialogContent>
				<DialogContentText>
					To edit this programme, please edit programme code, English
					and Chinese title here. Leave it be if no amendments are
					made.
				</DialogContentText>

				<Tooltip
					title="This field cannot be edited. Instead, create a new program with the new programme code."
					placement="right"
					arrow
				>
					<TextField
						value={code}
						disabled
						margin="dense"
						id="code"
						label="Programme Code"
						fullWidth
					/>
				</Tooltip>
				<TextField
					value={englishTitle}
					onChange={setEnglishTitle}
					autoFocus
					margin="dense"
					id="title_en"
					label="English Title"
					fullWidth
				/>
				<TextField
					value={chineseTitle}
					onChange={setChineseTitle}
					margin="dense"
					id="title_hk"
					label="Chinese Title"
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button onClick={onFinish} color="primary">
					Finish
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default EditProgramDialog;
