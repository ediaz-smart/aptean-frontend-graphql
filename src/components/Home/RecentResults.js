import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation,useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { makeStyles } from "@material-ui/core/styles";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/ArrowDownward";
// import movies from '../SearchedResults/movies'
import HomeService from '../../services/home'
import { format } from 'date-fns';
import ProgressBar from '../../shared/ProgressBar/Progress';
import { Fragment } from "react";
import { url } from '../../reducers/url';


const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
		width: '96%',
		margin: '30px auto',
		minHeight: '260px',
		// borderBottom: '1px solid #cec7c7'
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
const customStyles = {
	rows: {
	  style: {
		minHeight: '50px', // override the row height
	  }
	},
	headCells: {
	  style: {
		paddingLeft: '8px', // override the cell padding for head cells
		paddingRight: '8px',
		borderLeft:'1px solid #0606061f',
		'&:first-child': {
			borderLeft: '0',
		},
		fontWeight:'bold',
		color:'#4a5050'
	  },
	},
	cells: {
	  style: {
		paddingLeft: '8px', // override the cell padding for data cells
		paddingRight: '8px',
		borderLeft:'1px solid #0606061f',
		borderBottom:'1px solid #0606061f',
		'&:first-child': {
			borderLeft: '0',
		},
		display:'grid'
	  },
	  
	},
  };
const columns = [
	{
	  name: "Type",
	  selector: "type",
	  sortable: true
	},
	{
	  name: "Date",
	  selector: "date",
	  sortable: true
	},
	{
	  name: "Description",
	  selector: "description",
	  sortable: true,
	},
	{
		name: "",
		selector: "results",
		sortable: true
	  },
	  {
		name: " ",
		selector: "report",
		sortable: false,
	  }
  ];
   const isIndeterminate = indeterminate => indeterminate;
  const selectableRowsComponentProps = { indeterminate: isIndeterminate };

  
function RecentResults() {

	const [searchResultData, setSearchResultData] = useState([]);
	const history = useHistory();
	const classes = useStyles();
	const dispatch = useDispatch();
	useEffect(() => {
		(async () => {
			// const result = dispatch(getSearchResult());
			const result = await HomeService.getSearchResults(history);
			let tempArr = [];
			if(result && result.response_content && result.response_content.length > 0)
			{
				result.response_content.forEach(datas => {
					let tempObj = datas;
					let id = datas.id;
					tempObj['date'] = datas.date ? format(new Date(datas.date), 'dd-MMM-yyyy') : null;
					const regex = /Fulltext/i;
					const found = datas.type.match(regex);
					let type = 'Alignments';
					if(found && found.length >0){
						type = 'Documents';
					}
					let typeUrl = process.env.REACT_APP_BASE_URL+url.mostRecentTypeUrl+'wf:'+id+'.resdb/1'

					if(datas.status == 'STILL_RUNNING')
					{
						tempObj['results'] = <ProgressBar datas={datas} />
					}
					else if(datas.status == 'FAILED'){
						tempObj['results'] = datas.status
					}
					else {
						tempObj['results'] = <a href={typeUrl} target="_blank">{datas.results} {type}</a>
					}
					let classicLink = process.env.REACT_APP_API_URL+url.mostRecentClassicUrl+'&db=wf:'+id+'.resdb'
					if(datas.type == "GqWfABIpSearch")
					{
						let reportLink = process.env.REACT_APP_BASE_URL+url.mostRecentReportUrl+id
						tempObj["report"] = <Fragment><a href={reportLink} target="_blank">Report</a>
											<span className="mx-2">|</span>
											<a href={classicLink} target="_blank">Classic</a>
											</Fragment>
					}else {
						tempObj["report"] = <Fragment>
											<a href={classicLink} target="_blank">Classic</a>
											</Fragment>
					}
					tempArr.push(tempObj);
				})
			}
			
			setSearchResultData(tempArr);
		})();
	}, []);

	

	return (

		<div className={classes.grow}>
			{/* <ProgressBar /> */}
			<Row >
						<Col>
						<span className={'appTextColor '+classes.textHeading}>Most Recent Results</span><span className="pipeText appTextColor">|</span><span className={classes.pTagMargin}>
							{/* <a className={classes.anchorTag} href='#' onClick={e => e.preventDefault()}>All Search Results</a> */}
							<Link className={classes.anchorTag} to='/searchResult'>All Search Results</Link>
						</span>
						</Col>
					</Row>
					<Row className="mt-4">
						<Col>
						{/* <Table className="w-100" columns={columns} data={data} /> */}
						<DataTable
								columns={columns}
								data={searchResultData}
								defaultSortField="type"
								noDataComponent="No Searches have been submitted."
								sortIcon={<SortIcon />}
								customStyles={customStyles}
								noHeader={true}
						/>
						</Col>
					</Row>

			{/* <ProgressBar animated now={75} /> */}

		</div>

	);
}

export default RecentResults;