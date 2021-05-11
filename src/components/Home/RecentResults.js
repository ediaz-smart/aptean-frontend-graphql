import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import ReactTable from 'react-table';
import Table from "../../shared/Table/Table";
import axios from "axios";
import ProgressBar from 'react-bootstrap/ProgressBar'
import { makeStyles } from "@material-ui/core/styles";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/ArrowDownward";
import movies from '../SearchedResults/movies'

const Genres = ({ values }) => {
	return (
		<>
			{values.map((genre, idx) => {
				return (
					<span key={idx} className="badge">
						{genre}
					</span>
				);
			})}
		</>
	);
};
const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
		width: '96%',
		margin: '30px auto',
		minHeight: '260px',
		borderBottom: '1px solid #cec7c7'
	},
	savedForm: {
		backgroundColor: '#f5f2f2',
		height: '500px',
		paddingLeft: "70px",
		paddingTop: "34px"
	},
	anchorTag: {
		textDecoration: 'none',
		color: "#008EC5",
		fontWeight:'700'
	},
	p: {
		color: "#74a4d8",
		size: "20px"
	},
	textHeading: {
		fontWeight: "700 !important",
		color: "#5A6868",
		marginBottom: "5px"
	},
	columnPadding: {
		paddingLeft: "27px",
		paddingTop: "20px"
	},
	pTagMargin: {
		marginBottom: "0px",
		fontWeight: "500"
	},
	applicationPanelRow: {
		marginBottom: "15px"
	}
}));

const columns = [
	{
	  name: "Type",
	  selector: "title",
	  sortable: true
	},
	{
	  name: "Date",
	  selector: "year",
	  sortable: true
	},
	{
	  name: "Description",
	  selector: "runtime",
	  sortable: true,
	},
	{
		name: " ",
		selector: "director",
		sortable: true
	  },
	  {
		name: " ",
		selector: "title",
		sortable: false,
	  }
  ];
   const isIndeterminate = indeterminate => indeterminate;
  const selectableRowsComponentProps = { indeterminate: isIndeterminate };

  
function RecentResults() {

	const [data, setData] = useState([]);

	const classes = useStyles();
	useEffect(() => {
		(async () => {
			const result = await axios("https://api.tvmaze.com/search/shows?q=snow");
			setData(result.data);
		})();
	}, []);

	

	return (

		<div className={classes.grow}>

			<Row >
						<Col>
						<span className={'appTextColor '+classes.textHeading}>Most Recent Results</span><span className="pipeText appTextColor">|</span><span className={classes.pTagMargin}><a className={classes.anchorTag} href='#' onClick={e => e.preventDefault()}>All Search Results</a></span>
						</Col>
					</Row>
					<Row >
						<Col>
						{/* <Table className="w-100" columns={columns} data={data} /> */}
						<DataTable
								columns={columns}
								data={movies}
								defaultSortField="title"
								sortIcon={<SortIcon />}
						
						/>
						</Col>
					</Row>

			{/* <ProgressBar animated now={75} /> */}

		</div>

	);
}

export default RecentResults;