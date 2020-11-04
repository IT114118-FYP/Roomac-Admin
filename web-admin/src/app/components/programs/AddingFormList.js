import React from "react";
import AddingForm from "./AddingForm";
import { Grid } from "@material-ui/core";

class AddingFormList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			children: [false],
		};
	}

	handleAdd = (code, eng, chi) => {
		this.props.onAdd(code, eng, chi);
		this.appendChild();
	};

	appendChild() {
		this.setState({
			children: [...this.state.children, false],
		});
	}

	render() {
		return (
			<Grid container spacing={3}>
				{this.state.children.map((child, index) => (
					<Grid item xs={6} key={index}>
						<AddingForm
							onAdd={(code, eng, chi) =>
								this.handleAdd(code, eng, chi)
							}
						/>
					</Grid>
				))}
			</Grid>
		);
	}
}

export default AddingFormList;
