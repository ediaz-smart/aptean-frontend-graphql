import DataTable from "react-data-table-component";
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
import Modal from 'react-bootstrap/Modal'

import TextInput from '../../shared/Fields/TextInput';
import HomeService from '../../services/home'
import SearchManagementService from '../../services/searchmanagement'
import FolderTreeMenu from '../../shared/FolderTreeStructure/FolderTreeMenu';
import UtilsService from '../../helpers/utils';
import FolderIcon from '../../assets/image/folder.svg';
import FolderPlusIcon from '../../assets/image/folder-plus.svg';
import Checkbox from "@material-ui/core/Checkbox";
// import CheckBox from '../../shared/Fields/CheckBox';


const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
		width: '96%',
		margin: '130px auto',
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
		border: 'none !important'
	},
	projTitleActive: {
		backgroundColor: '#008EC5',
		color: '#fff',
		padding: '3px',
		borderRadius: '3px'
	},
	folderIcon: {
		width: '8%'
	},
	modalHeader: {
		borderBottom: 'none !important'
	},
	footerDiv: {
		padding: '0 30px'
	},
	checkBox: {
		transform: "scale(0.9)",
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
	const [defaultTitle, setDefaultTitle] = useState('Recent Search Results');
	const [defaultTitleId, setDefaultTitleId] = useState('');

	// Table Data Delete Variable
	const [confirmContent, setConfirmContent] = useState(true);
	const [delLoaderContent, setDelLoaderContent] = useState(false);
	const [errorContent, setErrorContent] = useState(false);
	const [modalShow, setModalShow] = React.useState(false);
	const [termsDisable, setTermsDisable] = React.useState(false);

	// Folder Delete Variable
	const [folderModalShow,setFolderModalShow] = React.useState(false);
	const [confirmFolderContent, setConfirmFolderContent] = useState(true);
	const [delFolderLoaderContent, setFolderDelLoaderContent] = useState(false);
	const [errorFolderContent, setFolderErrorContent] = useState(false);

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
		setDisableDelete(true);
		// }, 1000);

	};
	async function deleteSearch(type) {

		// console.log(defaultTitleId, "defaultTitleId")
		setModalShow(false);
		setFolderModalShow(false);
		setConfirmContent(false);
		setConfirmFolderContent(false);
		if(type === "record")
		{
			if (selectData.selectedCount > 0) {
				setModalShow(true);
				setDelLoaderContent(true);
				var getIds = selectData.selectedRows.map(function (a) { return a.id; }).join(',');
				deleteRecordFolder(getIds,type);
			}
		}else {
			if(defaultTitleId)
			{
				setFolderModalShow(true);
				setFolderDelLoaderContent(true);	
				deleteRecordFolder(defaultTitleId,type);
			}
		}
	}
	async function deleteRecordFolder(getIds,type) {
		const response = await SearchManagementService.deleteSearchResult(getIds, history);
		if (response && response.response_content && response.response_content.success.length > 0) {
			if(type === "record")
			{
				setModalShow(false);
				setConfirmContent(true);
				setDelLoaderContent(false);
				setErrorContent(false);
			}else {
				setFolderModalShow(false);
				setConfirmFolderContent(true);
				setFolderDelLoaderContent(false);
				setFolderErrorContent(false);
			}
			
			toast.success('Deleted Successfully');
			if (defaultTitle === 'Recent Search Results') {
				getDefaultSearchResult('defaultText', '');
			} else {
				if(type === "record")
				{
					getDefaultSearchResult('folder', defaultTitleId);
				}else{
					setDefaultTitle('Recent Search Results');
					getDefaultSearchResult('defaultText', '');
				}
				getFolderResultData();
			}

		} else {
			if(type === "record")
			{
				setModalShow(true);
				setDelLoaderContent(false);
				setErrorContent(true);
			}else {
				setFolderModalShow(true);
				setFolderDelLoaderContent(false);
				setFolderErrorContent(true);
			}
			// toast.error('Unable to Delete');
		}
	}
	async function getDefaultSearchResult(type, id) {
		let tempArr = [];

		// setSearchResultData([]);
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
					setFolderDetail(getResult.response_content.items[0]);
				}
			}
		}
	}
	const updateDefaultValue = (type) => {
		setDefaultTitle(type);
		setDefaultTitleId('')
		getDefaultSearchResult('defaultText', '');

	}
	// const deleteRecord = () => {
	// 	console.log(deleteRecord,'deleteRecord');
	// };
	const closeModal = () => {
		setModalShow(false);
		setTermsDisable(false);
		setConfirmContent(true);
	}
	const closeFolderModal = () => {
		setFolderModalShow(false);
		setTermsDisable(false);
		setConfirmFolderContent(true);
	}
	const openModal = () => {
		setModalShow(true);
		setConfirmContent(true);
		setDelLoaderContent(false);
		setErrorContent(false);
	}
	const openFolderModal = () => {
		setFolderModalShow(true);
		setConfirmFolderContent(true);
		setFolderDelLoaderContent(false);
		setFolderErrorContent(false);
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
									<span className={classes.projectTitle + ' ' + (defaultTitle === 'Recent Search Results' ? classes.projTitleActive : '')}>{t('recentSearchRes')}</span></a>
							</ListGroup.Item>

							{/* {folderDetail.map((value, index) => { */}
								<ListGroup.Item key={123} className={classes.projectListItem}>
									<FolderTreeMenu items={folderDetail} selectedTitle={defaultTitle} parentCallback={changeTitle} />
								</ListGroup.Item>

							{/* })} */}
							<ListGroup.Item className={classes.projectListItem} key="createNewFolder">
								<img src={FolderPlusIcon} className={classes.folderIcon} /> <a href="#" onClick={(e) => e.preventDefault()} className={"appLinkColor " + classes.projectTitle}>{t('addFolder')}</a>
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
						defaultSortField="date"
						defaultSortAsc={false}
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
					<Col className={"float-left " + classes.columnPadding + (defaultTitle !== 'Recent Search Results' && searchResultData.length > 0 ? ' d-block' : ' d-none')} md="6">
						<Button color={(disableDelete ? 'default' : 'secondary')} disabled={disableDelete} variant="contained" onClick={openModal} className={"text-capitalize mr-2 " + ' ' + (disableDelete ? 'disableBtnBorder' : 'deleteBtnColor')} type="submit">{t('deleteSelected')}</Button>
						<Button color={(disableDelete ? 'default' : 'secondary')} disabled={disableDelete} variant="contained" onClick={greetUser} className={"text-capitalize mr-2 " + ' ' + (disableDelete ? 'disableBtnBorder' : 'primaryBtn')} type="submit">{t('moveToFolder')}</Button>
						<Button color={(disableMergeBtn ? 'default' : 'secondary')} disabled={disableMergeBtn} variant="contained" onClick={greetUser} className={"text-capitalize mr-2 " + ' ' + (disableMergeBtn ? 'disableBtnBorder' : 'primaryBtn')} type="submit">{t('mergeResult')}</Button>
					</Col>
					<Col className={"float-right " + classes.columnPadding + (defaultTitle !== 'Recent Search Results' && searchResultData.length > 0 ? ' d-block' : ' d-none')} md="6">
						<Button color="primary" variant="contained" onClick={openFolderModal} className="loginSubmit text-capitalize mr-2" type="submit">{t('deleteEntireFolder')}</Button>&nbsp;&nbsp;&nbsp;
						<Button variant="contained" color="primary" className="text-capitalize mr-2 primaryBtn" type="submit">{t('createSubFolder')}</Button>
					</Col>
					{/* <Col className={classes.columnPadding} md="12"> */}

					{/* </Col> */}
				</Col>

			</Row>
			<Modal
				show={modalShow}
				size="md"
				aria-labelledby="contained-modal-title-vcente"
				centered
				contentClassName='modalPromptContent'
			>
				<Modal.Body className="appTextColor">
					<div className={(confirmContent ? 'd-block' : 'd-none')}>
						<p className="mb-3"><b>{t('deleteSelItems')}</b></p>
						<p className="mb-3">{t('deleteSelItemContent')}</p>
						<div className="mb-5 h-100">
							<Checkbox
								color="primary"
								className={"float-left p-0 " + classes.checkBox}
								name="acceptTerms"
								id="acceptTerms"
								checked={termsDisable}
								onClick={() => setTermsDisable(!termsDisable)}
							/>
							<p className={"float-left ml-1"}>{t('termsConditionText')}</p>
						</div>
						<div className={classes.footerDiv + " float-right"}>
							<Button onClick={()=>deleteSearch('record')} color={(!termsDisable ? 'default' : 'secondary')} disabled={!termsDisable} className={"text-capitalize mr-2 " + ' ' + (!termsDisable ? 'disableBtnBorder' : 'deleteBtnColor')} variant="contained">{t('deleteSelItems')}</Button>
							<Button onClick={closeModal} className="float-right mr-2 primaryBtn" color="secondary" variant="contained">{t('cancel')}</Button>
						</div>
					</div>
					<div className={"text-center " + (delLoaderContent ? 'd-block' : 'd-none')}>
						<p className="mb-3">{t('deletingItems')}</p>
						<p className="mb-3">{t('takeTimeText')}</p>
					</div>
					<div className={(errorContent ? 'd-block' : 'd-none')}>
						<p className="mb-3">{t('errorDeletTitle')}</p>
						<p className="mb-3">{t('contactText1')} <a href="support@gqlifesciences.com" onClick={(e) => e.preventDefault()}>support@gqlifesciences.com</a> {t('contactText2')}</p>
						<div className={classes.footerDiv + " float-right"}>
							<Button onClick={closeModal} className="float-right mr-2 primaryBtn" color="secondary" variant="contained">{t('close')}</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
			<Modal
				show={folderModalShow}
				size="md"
				aria-labelledby="contained-modal-title-vcente"
				centered
				contentClassName='modalPromptContent'
			>
				<Modal.Body className="appTextColor">
					<div className={(confirmFolderContent ? 'd-block' : 'd-none')}>
						<p className="mb-3"><b>{t('deleteSelFolder')}</b></p>
						<p className="mb-3">{t('deleteSelFolderContent')}</p>
						<div className="mb-5 h-100">
							<Checkbox
								color="primary"
								className={"float-left p-0 " + classes.checkBox}
								name="acceptTerms"
								id="acceptTerms"
								checked={termsDisable}
								onClick={() => setTermsDisable(!termsDisable)}
							/>
							<p className={"float-left ml-1"}>{t('termsConditionText')}</p>
						</div>
						<div className={classes.footerDiv + " float-right"}>
							<Button onClick={()=>deleteSearch('folder')} color={(!termsDisable ? 'default' : 'secondary')} disabled={!termsDisable} className={"text-capitalize mr-2 " + ' ' + (!termsDisable ? 'disableBtnBorder' : 'deleteBtnColor')} variant="contained">{t('deleteSelFolder')}</Button>
							<Button onClick={closeFolderModal} className="float-right mr-2 primaryBtn" color="secondary" variant="contained">{t('cancel')}</Button>
						</div>
					</div>
					<div className={"text-center " + (delFolderLoaderContent ? 'd-block' : 'd-none')}>
						<p className="mb-3">{t('deletingFolder')}</p>
						<p className="mb-3">{t('takeTimeText')}</p>
					</div>
					<div className={(errorFolderContent ? 'd-block' : 'd-none')}>
						<p className="mb-3">{t('errorDeleteFolderTitle')}</p>
						<p className="mb-3">{t('contactText1')} <a href="support@gqlifesciences.com" onClick={(e) => e.preventDefault()}>support@gqlifesciences.com</a> {t('contactText2')}</p>
						<div className={classes.footerDiv + " float-right"}>
							<Button onClick={closeFolderModal} className="float-right mr-2 primaryBtn" color="secondary" variant="contained">{t('close')}</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>

	);
}


export default SearchManagement;
