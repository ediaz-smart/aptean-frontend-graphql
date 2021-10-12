import React, { useMemo, useState, useEffect, Fragment } from "react";
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { makeStyles } from "@material-ui/core/styles";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/ArrowDownward";
import { format } from 'date-fns';
import InfoIcon from '@material-ui/icons/Info';
import RedoIcon from '@material-ui/icons/Redo';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
// import movies from '../SearchedResults/movies'
import HomeService from '../../services/home'
// import UtilsService from '../../helpers/utils';
import Constant from '../../helpers/constant';
import { url } from '../../reducers/url';
import ProgressBar from '../../shared/ProgressBar/Progress';


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
		fontWeight: '700'
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
		// fontWeight: "500"
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
			borderLeft: '1px solid #0606061f',
			'&:first-child': {
				borderLeft: '0',
				maxWidth: '160px'
			},
			'&:nth-child(2)': {
				maxWidth: '110px'
			},
			'&:nth-child(5), &:nth-child(4)': {
				maxWidth: '200px'
			},
			fontWeight: '700',
			color: '#777777',
			justifyContent: 'start !important'
		},
	},
	cells: {
		style: {
			paddingLeft: '8px', // override the cell padding for data cells
			paddingRight: '8px',
			borderLeft: '1px solid #0606061f',
			// borderBottom:'1px solid #0606061f',
			'&:first-child': {
				borderLeft: '0'
			},
			display: 'grid',
			justifyContent: 'start !important'
		},

	},
};
const columns = [
	{
		name: "Type",
		selector: "type",
		sortable: false,
		center: true,
		style: {
			maxWidth: '160px'
		}
	},
	{
		name: "Date",
		selector: "date",
		sortable: false,
		center: true,
		style: {
			maxWidth: '110px'
		}
	},
	{
		name: "Description",
		selector: "description",
		sortable: false,
		center: true,
		// cell: row => <div style={{ textAlign: 'left' }}>{row.description}</div>,
	},
	{
		name: "",
		selector: "results",
		sortable: false,
		style: {
			justifyContent: 'unset !important',
			maxWidth: '200px'
		}
	},
	{
		name: " ",
		selector: "report",
		sortable: false,
		center: true,
		style: {
			justifyContent: 'center !important',
			maxWidth: '200px'
		}
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
			getDefaultSearchResult();
		})();
	}, []);
	const getDefaultSearchResult = async () => {
		const result = await HomeService.getSearchResults(history);
		let tempArr = [];
		if (result && result.response_content && result.response_content.length > 0) {
			// tempArr = await UtilsService.mostRecentResCalculation(result,'home');
			tempArr = await getSearchDataArr(result, 'home');
		}


		// Getting only 9 array from the response as per the ppt documentation
		tempArr = tempArr.slice(0, 9);
		setSearchResultData(tempArr);
	}
	const getProgressStatus = async (isCompleted) => {
		console.log(isCompleted, 'isCompleted')
		if (isCompleted) {
			getDefaultSearchResult();
		}
	}
	async function getSearchDataArr(data, pagetype) {
		try {
			let tempArr = [];
			let resultData;
			if (pagetype == 'searchfolder') {
				resultData = data.response_content.results;
			} else {
				resultData = data.response_content;
			}
			resultData.forEach(datas => {
				let tempObj = datas;
				let id = datas.id;
				tempObj['date'] = datas.date ? format(new Date(datas.date), 'dd-MMM-yyyy') : null;
				const regex = /Fulltext/i;
				if (datas.type !== null && datas.type !== '') {
					const found = datas.type.match(regex);
					if (found && found.length > 0) {
						type = 'Documents';
					}
				} else {
					datas.type = ' '
				}
				let type = 'Alignments';

				let mostRecentTypeUrl = url.mostRecentTypeUrl
				mostRecentTypeUrl = mostRecentTypeUrl.replace('**', id);
				let typeUrl = process.env.REACT_APP_BASE_URL + mostRecentTypeUrl;
				if (datas.type != '') {
					if (datas.type === "GqWfMerge" && (datas.status == 'UNKNOWN' || datas.status == 'STILL_RUNNING')) {
						tempObj['results'] = <ProgressBar getStatus={getProgressStatus} datas={datas} />
					}
					else if (datas.type !== 'GqFolder') {
						if (datas.status == 'STILL_RUNNING') {
							tempObj['results'] = <ProgressBar getStatus={getProgressStatus} datas={datas} />
						}
						else if (datas.status == 'FAILED') {
							tempObj['results'] = <a href="#" className={(datas.status == 'FAILED' ? 'failedIconColor' : '')} onClick={(e) => e.preventDefault()}>Search Failed</a>;
						}
						else if (datas.status == 'CANCELLED') {
							tempObj['results'] = <span>Search cancelled</span>;
						}
						else {
							if (datas.results > 0) {
								tempObj['results'] = <a href={typeUrl} target="_blank" rel="noreferrer">{datas.results} {type}</a>
							} else {
								tempObj['results'] = <span>{datas.results ? datas.results + ' ' + type : ''}</span>
								// tempObj['results'] = <span></span>
							}

						}
					} else {
						tempObj['results'] = <a href="#" onClick={(e) => e.preventDefault()}>Empty</a>;
					}
				} else {
					tempObj['results'] = <a href="#" onClick={(e) => e.preventDefault()}>Empty</a>;
				}
				// console.log(parseInt(datas.results),'datas.results');
				let mostRecentClassicUrl = url.mostRecentClassicUrl
				mostRecentClassicUrl = mostRecentClassicUrl.replace('**', id);
				let classicLink = process.env.REACT_APP_API_URL + mostRecentClassicUrl
				if (datas.status == 'FAILED') {
					tempObj["report"] = '';
				} else {

					if (datas.type != '' && (datas.status != 'STILL_RUNNING' && datas.status != 'CANCELLED')) {
						// console.log(datas.results.props,'datas.results');
						if (datas.results.props.children && datas.results.props.children[0] > 0) {
							if (datas.type == "GqWfABIpSearch") {
								let mostRecentReportUrl = url.mostRecentReportUrl
								mostRecentReportUrl = mostRecentReportUrl.replace('**', id);
								let reportLink = process.env.REACT_APP_BASE_URL + mostRecentReportUrl
								tempObj["report"] = <Fragment><a href={reportLink} target="_blank" rel="noreferrer">Report</a>
									<span className="mx-2">|</span>
									<a href={classicLink} target="_blank" rel="noreferrer">Classic</a>
								</Fragment>
							} else if (datas.type !== "GqFolder") {
								tempObj["report"] = <Fragment>
									<a href={classicLink} target="_blank" rel="noreferrer">Classic</a>
								</Fragment>
							} else {
								tempObj["report"] = '';
							}
						} else {
							tempObj["report"] = '';
						}
					} else {
						tempObj["report"] = '';
					}
				}
				tempObj['type'] = Constant['searchType'][datas.type] ? Constant['searchType'][datas.type] : datas.type;
				if (pagetype === "searchmanagement" || pagetype === "searchfolder") {
					tempObj["info"] = <Fragment>
						<a href="#" onClick={(e) => e.preventDefault()}><InfoIcon className={"mr-2 appLink pe-none " + (datas.status == 'FAILED' ? 'failedIconColor' : '')} /></a>
						<a href="#" onClick={(e) => e.preventDefault()}><RedoIcon className="mr-2 appLink" /></a>
						<a href="#" onClick={(e) => e.preventDefault()}><AccessAlarmIcon className="appLink" /></a>
					</Fragment>
				}
				tempArr.push(tempObj);
			})
			return tempArr;
		} catch (error) {
			console.error(error);
		}

	}

	return (

		<div className={classes.grow}>
			{/* <ProgressBar /> */}
			<Row >
				<Col>
					<span className={"subHeading"}>Most Recent Results</span><span className="pipeText appTextColor">|</span><span className={classes.pTagMargin + " bodyText"}>
						{/* <a className={classes.anchorTag} href='#' onClick={e => e.preventDefault()}>All Search Results</a> */}
						<Link className="appLink" to='/searchResult'>All Search Results</Link>
					</span>
				</Col>
			</Row>
			<Row className="mt-4">
				<Col>
					{/* <Table className="w-100" columns={columns} data={data} /> */}
					<DataTable
						columns={columns}
						data={searchResultData}
						defaultSortField="date"
						defaultSortAsc={false}
						sortable={false}
						sortServer={true}
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