import DataTable from "react-data-table-component";
import Checkbox from "@material-ui/core/Checkbox";
import SortIcon from "@material-ui/icons/ArrowDownward";
// import movies from "./movies";
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';
import TextInput from '../../shared/Fields/TextInput';
import { useTranslation } from "react-i18next";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
	grow: {
        flexGrow: 1,
        width: '96%',
        margin: '115px auto 28px',
        minHeight: '260px',
        borderBottom: '1px solid #cec7c7',
        padding: '23px 0 5px'
    },
	loginDiv: {
		border: '2px solid #bfb4b4',
		borderRadius: '6px',
		padding: '20px',
		height: '100%'
	},
	forgotLink: {
		marginTop: '10px',
		a: {
			color: '#008EC5'
		}
	},
	textHeading: {
		fontWeight: "700 !important",
		color: "#5A6868",
		fontSize: 'larger'
		// marginBottom: "400px",

	},
	columnPadding: {
		paddingTop: '20px',
		paddingLeft: '20px'
	},
	columnPaddings: {
		paddingTop: '5px',
		paddingLeft: '877px'
	},
	line: {
		borderBottom: '1px solid #E7E4E4',
		paddingBottom: '20px',
	},
	columnPad: {
		paddingTop: '45px',
	}
}));

// const conditionalRowStyles = [
// 	{
// 		when: row => row.director < 300,
// 		style: {
// 			backgroundColor: 'green',
// 			color: 'white',
// 			'&:hover': {
// 				cursor: 'pointer',
// 			},
// 		},
// 	},
// 	// You can also pass a callback to style for additional customization
// 	{
// 		when: row => row.director < 300,
// 		style: row => ({
// 			backgroundColor: row.isSpecia ? 'pink' : 'inerit',
// 		}),
// 	},
// ];

const columns = [
	{
		name: "Type",
		selector: "title",
		sortable: true
	},
	{
		name: "Last Search Date",
		selector: "date",
		sortable: true
	},
	{
		name: "Name",
		selector: "director",
		sortable: true,
		left: true
	}
];

const isIndeterminate = indeterminate => indeterminate;
const selectableRowsComponentProps = { indeterminate: isIndeterminate };

function SearchManagement() {
	const classes = useStyles();
	const [thing, setThing] = useState();
	const { t, i18n } = useTranslation('common');
	const handleAction = value => setThing(value);
	// unlike class methods updateState will be re-created on each render pass, therefore, make sure that callbacks passed to onSelectedRowsChange are memoized using useCallback
	const updateState = useCallback(state => setThing(state));
	function updateVal(state) {
		setThing(state)
	}
	function greetUser() {
		// console.log(updateState,"SAMple Data that enters")
		console.log(thing, "SAMple")
		const data = [];
		const dataValues = thing && data.push(thing.selectedRows[0]);
		console.log(data, "data data data");
		if (thing.selectedCount >= 1 && data && data.length > 0) {
			toast.success("Successfully Deleted");
			console.log("Hi there, user!");
		}
		else {
			toast.error("Select Any One Item");
			console.log("Hi");
		}

	}

	return (
		<div className={classes.grow}>
			<Row>
				<Col md="3">
					<Col md="12">
						<div className="form-group">
							<TextInput 
								fullWidth
								variant="outlined"
								id="searchResSet"
								name="searchResSet"
								label={t('searchResSet')}
								type="text"
								value=""
								InputProps={{
									endAdornment: (
									  <InputAdornment>
										<IconButton>
										  <SearchIcon />
										</IconButton>
									  </InputAdornment>
									)
								}}
								// onChange={formik.handleChange}
							/>
						</div>
					</Col>
					<Col md="12">
					</Col>
				</Col>
				<Col md="9">
					<DataTable
						columns={columns}
						data={[]}
						defaultSortField="title"
						sortIcon={<SortIcon />}
						onSelectedRowsChange={updateVal}
						noDataComponent="No Searches have been submitted."
						//   pagination
						// conditionalRowStyles={conditionalRowStyles}
						selectableRows
						selectableRowsComponent={Checkbox}
						selectableRowsComponentProps={selectableRowsComponentProps}
						noHeader={true}
					/>
				</Col>

			</Row>

			<Row className="float-right">
				<Col className={classes.columnPadding}>
					
    <Button color="primary" variant="contained" onClick={greetUser} className="loginSubmit text-capitalize mr-2" type="submit">Delete Entire Folder</Button>&nbsp;&nbsp;&nbsp;
	<Button variant="contained" color="primary" type="submit">Create New Folder</Button>

				</Col>


			</Row>
		</div>

	);
}


export default SearchManagement;