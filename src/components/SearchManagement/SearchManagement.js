import DataTable from "react-data-table-component";
import Checkbox from "@material-ui/core/Checkbox";
import SortIcon from "@material-ui/icons/ArrowDownward";
// import movies from "./movies";
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ListGroup from 'react-bootstrap/ListGroup'


import TextInput from '../../shared/Fields/TextInput';
import HomeService from '../../services/home'
import SearchManagementService from '../../services/searchmanagement'
import FolderTreeMenu from '../../shared/FolderTreeStructure/FolderTreeMenu';
import UtilsService from '../../helpers/utils';
import FolderIcon from '../../assets/image/folder.svg';
import FolderPlusIcon from '../../assets/image/folder-plus.svg';


const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
		width: '96%',
		margin: '115px auto',
		minHeight: '260px',
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
	},
	projectTitle: {
		margin: '0px 4px',
		position: 'relative',
		top: '2px',
		fontSize: '15px',
		padding: '0'
	},
	projectListItem: {
		padding: '0.2rem 0.25rem !important',
		border: 'none !important',
		height: '35px'
	},
	projTitleActive: {
		backgroundColor: '#008EC5',
		color: '#fff',
		padding: '3px',
		borderRadius: '3px'
	},
	folderIcon:{
		width:'8%'
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
			},
			fontWeight: 'bold',
			color: '#4a5050'
		},
	},
	cells: {
		style: {
			paddingLeft: '8px', // override the cell padding for data cells
			paddingRight: '8px',
			borderLeft: '1px solid #0606061f',
			borderBottom: '1px solid #0606061f',
			'&:first-child': {
				borderLeft: '0',
			},
			display: 'grid'
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
		name: "",
		selector: "info",
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

function SearchManagement(props) {
	const classes = useStyles();
	const history = useHistory();
	const [selectData, setSelectData] = useState();
	const [folderDetail, setFolderDetail] = useState([]);
	const [disableDelete, setDisableDelete] = useState(true);
	const [disableMergeBtn, setDisableMergeBtn] = useState(true);
	const [searchResultData, setSearchResultData] = useState([]);
	const [folderData, setFolderData] = useState([]);
	const [defaultTitle, setDefaultTitle] = useState('Recent Search Results');
	const [defaultTitleId, setDefaultTitleId] = useState('');
	const [defaultTitleType, setDefaultTitleType] = useState('defaultText');
	const { t, i18n } = useTranslation('common');
	const handleAction = value => setSelectData(value);
	// unlike class methods updateState will be re-created on each render pass, therefore, make sure that callbacks passed to onSelectedRowsChange are memoized using useCallback
	const updateState = useCallback(state => setSelectData(state));
	function updateVal(state) {
		console.log(state, 'state');
		let mergeData = [];
		state.selectedRows.map((value, index) => {
			if (value.type !== 'GqFolder') {
				mergeData.push(value.id);
			}
		});

		if (state.selectedCount > 0) {
			setDisableDelete(false);
			if (state.selectedCount >= 2 && mergeData.length >= 2) {
				setDisableMergeBtn(false);
			} else {
				setDisableMergeBtn(true);
			}
		} else {
			setDisableDelete(true);
		}
		setSelectData(state)
	}
	function greetUser() {
		// console.log(updateState,"SAMple Data that enters")
		console.log(selectData, "SAMple")
		const data = [];
		const dataValues = selectData && data.push(selectData.selectedRows[0]);
		console.log(data, "data data data");
		if (selectData.selectedCount >= 1 && data && data.length > 0) {
			toast.success("Successfully Deleted");
			console.log("Hi there, user!");
		}
		else {
			toast.error("Select Any One Item");
			console.log("Hi");
		}

	}
	const getRowData = (event) => {
		// console.log(event, 'event');
	};
	const changeTitle = (event) => {
		setDefaultTitle(event.text_label);
		setDefaultTitleId(event.id);
		// setTimeout(() => {
		getDefaultSearchResult('folder', event.id);
		// }, 1000);

	};
	async function deleteSearch() {
		console.log(defaultTitleId, "defaultTitleId")
		if (selectData.selectedCount > 0) {
			var getIds = selectData.selectedRows.map(function (a) { return a.id; }).join(',');
			const response = await SearchManagementService.deleteSearchResult(getIds, history);
			if (response && response.response_content && response.response_content.success.length > 0) {
				toast.success('Deleted Successfully');
				if (defaultTitle === 'Recent Search Results') {
					getDefaultSearchResult('defaultText', '');
				} else {
					getDefaultSearchResult('folder', defaultTitleId);
					getFolderResultData();
				}

			} else {
				toast.error('Unable to Delete Record');
			}
		}
	}
	async function getDefaultSearchResult(type, id) {
		let tempArr = [];

		// setSearchResultData([]);
		console.log(searchResultData, 'searchResultData')
		console.log(type, 'type');
		if (type == "defaultText") {
			const result = await HomeService.getSearchResults(history);
			if (result && result.response_content && result.response_content.length > 0) {
				tempArr = await UtilsService.mostRecentResCalculation(result, 'searchmanagement');
			}
		} else {
			const result = await SearchManagementService.getFolderData(id, history);
			if (result && result.response_content) {
				if (result.response_content.results.length > 0) {
					tempArr = await UtilsService.mostRecentResCalculation(result, 'searchfolder');
				}
			}
		}
		setSearchResultData(tempArr);

	}
	async function getFolderResultData() {
		const folderData = await SearchManagementService.getProjectFolders(history);
		if (folderData && folderData.response_content) {
			let getParentFolderId = folderData.response_content.id;
			const getResult = await SearchManagementService.getProjectFolderData(getParentFolderId, history);
			if (getResult && getResult.response_content) {
				if (getResult.response_content.items && getResult.response_content.items.length > 0) {
					setFolderDetail(getResult.response_content.items[0].children);
				}
			}
		}
	}
	const updateDefaultValue = (type) => {
		setDefaultTitle(type);
		setDefaultTitleId('')
		getDefaultSearchResult('defaultText', '');
		
	}
	useEffect(() => {
		(async () => {
			// const result = dispatch(getSearchResult());
			getDefaultSearchResult('defaultText', '');
			getFolderResultData();
		})();
	}, []);

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
					<Col md="12" className="appTextColor">
						<h6><b>Projects</b></h6>
						<ListGroup defaultActiveKey="#link1" className={"projectList"}>
							<ListGroup.Item className={classes.projectListItem} key="RecentSearch">
								<a className="cursorPointer text-decoration-none appTextColor" onClick={() => updateDefaultValue('Recent Search Results')}>
									<img src={FolderIcon} className={classes.folderIcon} /> 
									<span className={classes.projectTitle + ' ' + (defaultTitle === 'Recent Search Results' ? classes.projTitleActive : '')}>Recent Search Results</span></a>
							</ListGroup.Item>
						
						{folderDetail.map((value, index) => {
							return <ListGroup.Item key={value.id} className={classes.projectListItem}>
								<FolderTreeMenu items={value} selectedTitle={defaultTitle} parentCallback={changeTitle} />
							</ListGroup.Item>

						})}
							<ListGroup.Item className={classes.projectListItem} key="createNewFolder">
							<img src={FolderPlusIcon} className={classes.folderIcon} /> <a href="#" onClick={(e) => e.preventDefault()} className={"appLinkColor "+classes.projectTitle}>Add New Folder</a>
							</ListGroup.Item>

						</ListGroup>
						{/* <p><a className="cursorPointer text-decoration-none appTextColor" onClick={() => changeTitle('Recent Search Results1')}><FolderOpenIcon /><span className={classes.projectTitle}>test1</span></a></p> */}
						<h6 className="mt-4"><b>Results Shared with me</b></h6>
						<ListGroup defaultActiveKey="#link1" className={"projectList"}>
							<ListGroup.Item className={classes.projectListItem} key="search1">
								<a className="cursorPointer text-decoration-none appTextColor" onClick={() => updateDefaultValue('Search1')}>
									<img src={FolderIcon} className={classes.folderIcon} /> 
									<span className={classes.projectTitle + ' ' + (defaultTitle === 'Search1' ? classes.projTitleActive : '')}>Search1</span></a>
							</ListGroup.Item>
							<ListGroup.Item className={classes.projectListItem} key="search2">
								<a className="cursorPointer text-decoration-none appTextColor" onClick={() => updateDefaultValue('Search2')}>
									<img src={FolderIcon} className={classes.folderIcon} /> 
									<span className={classes.projectTitle + ' ' + (defaultTitle === 'Search2' ? classes.projTitleActive : '')}>Search2</span></a>
							</ListGroup.Item>
						</ListGroup>
							


					</Col>
				</Col>
				<Col md="9">
					<h6 className="appTextColor"><b><img src={FolderIcon} /> <span className={classes.projectTitle}>{defaultTitle}</span></b></h6>
					<DataTable
						columns={columns}
						data={searchResultData}
						defaultSortField="type"
						sortIcon={<SortIcon />}
						onSelectedRowsChange={updateVal}
						noDataComponent={t('noSearchSubmit')}
						customStyles={customStyles}
						selectableRowsNoSelectAll
						selectableRowsComponent={Checkbox}
						selectableRowsComponentProps={selectableRowsComponentProps}
						selectableRows
						noHeader={true}
						// onRowClicked={getRowData}
						onRowClicked={getRowData}
					/>
					<Col className={"float-left " + classes.columnPadding + (searchResultData.length >0 ? ' d-block':' d-none')} md="6">
						<Button color={(disableDelete ? 'default' : 'secondary')} disabled={disableDelete} variant="contained" onClick={deleteSearch} className={"text-capitalize mr-2 " + ' ' + (disableDelete ? 'disableBtnBorder' : 'deleteBtnColor')} type="submit">Delete Selected</Button>
						<Button color={(disableDelete ? 'default' : 'secondary')} disabled={disableDelete} variant="contained" onClick={greetUser} className={"text-capitalize mr-2 " + ' ' + (disableDelete ? 'disableBtnBorder' : 'primaryBtn')} type="submit">Move to Folder</Button>
						<Button color={(disableMergeBtn ? 'default' : 'secondary')} disabled={disableMergeBtn} variant="contained" onClick={greetUser} className={"text-capitalize mr-2 " + ' ' + (disableMergeBtn ? 'disableBtnBorder' : 'primaryBtn')} type="submit">Merge Results</Button>
					</Col>
					<Col className={"float-right " + classes.columnPadding+ (searchResultData.length >0 ? ' d-block':' d-none')} md="6">

						<Button color="primary" variant="contained" onClick={greetUser} className="loginSubmit text-capitalize mr-2" type="submit">Delete Entire Folder</Button>&nbsp;&nbsp;&nbsp;
							<Button variant="contained" color="primary" className="text-capitalize mr-2 primaryBtn" type="submit">Create New Folder</Button>

					</Col>
					{/* <Col className={classes.columnPadding} md="12"> */}

					{/* </Col> */}
				</Col>

			</Row>
		</div>

	);
}


export default SearchManagement;
