import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function EditProgramDialog({
	open,
	onClose,
	onSubmit,
	editCode,
	editEnglishTitle,
	editChineseTitle,
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
				<TextField
					value={editCode}
					onChange={}
					autoFocus
					margin="dense"
					id="code"
					label="Programme Code"
					fullWidth
				/>
				<TextField
					value={editEnglishTitle}
					margin="dense"
					id="title_en"
					label="English Title"
					fullWidth
				/>
				<TextField
					value={editChineseTitle}
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
				<Button onClick={onSubmit} color="primary">
					Finish
				</Button>
			</DialogActions>
		</Dialog>
	);
}
