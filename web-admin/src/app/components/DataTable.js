import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import AutorenewIcon from "@material-ui/icons/Autorenew";

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
	const {
		classes,
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort,
		headCells,
	} = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						indeterminate={
							numSelected > 0 && numSelected < rowCount
						}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{ "aria-label": "select all rows" }}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? "right" : "left"}
						padding={headCell.disablePadding ? "none" : "default"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<span className={classes.visuallyHidden}>
									{order === "desc"
										? "sorted descending"
										: "sorted ascending"}
								</span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:
		theme.palette.type === "light"
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(
						theme.palette.secondary.light,
						0.85
					),
			  }
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark,
			  },
	title: {
		flex: "1 1 100%",
	},
}));

const EnhancedTableToolbar = ({
	title,
	onDelete,
	onEdit,
	onRefresh,
	numSelected,
	selected,
	clearSelected,
	editTag,
	deleteTag,
}) => {
	const classes = useToolbarStyles();

	const handleEdit = () => {
		localStorage.setItem(editTag, selected[0]);
		onEdit();
	};

	const handleDelete = () => {
		localStorage.setItem(deleteTag, JSON.stringify(selected));
		onDelete();
		clearSelected();
	};

	const TableButton = ({ title, onClick, children }) => {
		return (
			<Tooltip title={title}>
				<IconButton aria-label={title} onClick={onClick}>
					{children}
				</IconButton>
			</Tooltip>
		);
	};

	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}
		>
			{numSelected > 0 ? (
				<Typography
					className={classes.title}
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{numSelected} selected
				</Typography>
			) : (
				<Typography
					className={classes.title}
					variant="h6"
					id="tableTitle"
					component="div"
				>
					{title}
				</Typography>
			)}

			{numSelected > 0 ? (
				numSelected === 1 ? (
					<>
						<TableButton title="Edit" onClick={handleEdit}>
							<EditIcon />
						</TableButton>
						<TableButton title="Delete" onClick={handleDelete}>
							<DeleteIcon />
						</TableButton>
					</>
				) : (
					<TableButton title="Delete" onClick={handleDelete}>
						<DeleteIcon />
					</TableButton>
				)
			) : (
				<>
					<TableButton title="Search">
						<SearchIcon />
					</TableButton>
					<TableButton title="Refresh" onClick={onRefresh}>
						<AutorenewIcon />
					</TableButton>
				</>
			)}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	paper: {
		width: "100%",
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: 750,
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1,
	},
}));

export default function DataTable({
	title,
	headCells,
	data,
	onEdit,
	onDelete,
	onRefresh,
	editTag,
	deleteTag,
}) {
	const classes = useStyles();
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState(headCells[0].id);
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = data.map((n) => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const clearSelected = () => setSelected([]);

	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}
		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar
					title={title}
					numSelected={selected.length}
					selected={selected}
					clearSelected={clearSelected}
					editTag={editTag}
					deleteTag={deleteTag}
					onEdit={onEdit}
					onDelete={onDelete}
					onRefresh={onRefresh}
				/>
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="medium"
						aria-label="enhanced table"
					>
						<EnhancedTableHead
							classes={classes}
							numSelected={selected.length}
							headCells={headCells}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={data.length}
						/>
						<TableBody>
							{stableSort(data, getComparator(order, orderBy))
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((item, index) => {
									const isItemSelected = isSelected(item.id);
									const labelId = `enhanced-table-checkbox-${index}`;
									return (
										<TableRow
											hover
											onClick={(event) =>
												handleClick(event, item.id)
											}
											role="checkbox"
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={item.id}
											selected={isItemSelected}
										>
											<TableCell padding="checkbox">
												<Checkbox
													checked={isItemSelected}
													inputProps={{
														"aria-labelledby": labelId,
													}}
												/>
											</TableCell>

											{Object.keys(item).map((key) => {
												return (
													<TableCell
														align="left"
														key={key}
													>
														{item[key]}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: 53 * emptyRows,
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}
