import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import { Box, CircularProgress, Typography } from "@material-ui/core";

import "../styles/cursor.css";

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

const getLabel = (id, labels) => {
	const instance = labels.find((item, index) => {
		if (item.id === id) {
			return item;
		} else return null;
	});
	if (instance) return instance.label;
};

const createHeadCells = (items, labels) => {
	if (!items) return;
	var temp = [];
	for (let index = 0; index < Object.keys(items[0]).length; index++) {
		labels.forEach((label) => {
			if (Object.keys(items[0])[index] === label.id) {
				const headCell = {
					id: Object.keys(items[0])[index],
					label: getLabel(Object.keys(items[0])[index], labels),
					numeric: false,
					disablePadding: false,
				};
				temp.push(headCell);
			}
		});
	}
	return temp;
};

function EnhancedTableHead({
	classes,
	order,
	orderBy,
	onRequestSort,
	headCells,
}) {
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
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
	onRequestSort: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
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

function DataTableContext({ data, labels, onClick }) {
	const classes = useStyles();
	const [headCellData] = useState(createHeadCells(data, labels));
	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState(headCellData[0].id);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="medium"
						aria-label="enhanced table"
					>
						<EnhancedTableHead
							classes={classes}
							headCells={headCellData}
							order={order}
							orderBy={orderBy}
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
									const labelsID = labels.map(
										(label) => label.id
									);
									return (
										<TableRow
											className="hover"
											hover
											onClick={(event) =>
												onClick(event, item.id)
											}
											tabIndex={-1}
											key={item.id}
										>
											{Object.keys(item).map((key) => {
												if (labelsID.includes(key)) {
													return (
														<TableCell
															align="left"
															key={key}
														>
															{item[key]}
														</TableCell>
													);
												} else return null;
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

export default function DataTable({ loading, data, labels, onClick }) {
	return (
		<div>
			{loading ? (
				<Box
					width="100%"
					display="flex"
					justifyContent="center"
					alignItems="center"
				>
					<CircularProgress />
				</Box>
			) : data === null || data === undefined || data.length === 0 ? (
				<Box
					width="100%"
					display="flex"
					justifyContent="center"
					alignItems="center"
				>
					<Typography>No Data Available</Typography>
				</Box>
			) : (
				<DataTableContext
					data={data}
					labels={labels}
					onClick={onClick}
				/>
			)}
		</div>
	);
}
