import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import MuiTreeItem from "@material-ui/lab/TreeItem";
import { Formik, useField } from "formik";
import FolderIcon from '../../assets/image/folder.png';

const initialValues = {};


const useStyles = makeStyles({
	root: {
		// height: 110,
		flexGrow: 1,
		maxWidth: 400,
		'&.MuiTreeItem-label': {
			backgroundColor: 'none !important'
		},
	},
	projectTitle: {
		margin: '0px 4px',
		position: 'relative',
		top: '2px',
		fontSize: '15px',
		padding: '0'
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
});
const TreeItem = withStyles({
	root: {
		"&.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label": {
			backgroundColor: '#fff !important',
		},
		// "&.Mui-selected > .MuiTreeItem-group":{
		// 	marginLeft: '32px !important'
		// },
		// ".MuiCollapse-entered > .MuiTreeItem-group":{
		// 	marginLeft: '32px !important'
		// }
	},
	label: {
		right: '19px',
		paddingLeft: 0
	}
})(MuiTreeItem);

const FolderTreeMenu = ({ items, parentCallback, selectedTitle,selectedTitleId,type,moveFolderCallback,expandedIds,infoFolderIds,moveFolderId }) => {
	const classes = useStyles();
	const [defaultTitle, setDefaultTitle] = useState('');
	const [defaultTitleId, setDefaultTitleId] = useState('');
	const [moveToFolderId, setMoveToFolderId] = useState('');
	const [selectTitle, setSelectTitle] = useState('');
	items.text_label = 'My Searches';
	expandedIds = expandedIds ? expandedIds : [];
	infoFolderIds = infoFolderIds ? infoFolderIds:[];

	useEffect(() => {
		console.log(moveFolderId,'moveFolderId');
		setDefaultTitle(selectedTitle);
		setDefaultTitleId(selectedTitleId);
		setMoveToFolderId(moveFolderId);
	});
	function showString(str){
        let getLength = str.length;
        if(getLength > 23){
            str = str.substring(0,23)+' ...';
        }
        return str;
        
    }
	const renderTree = (nodes, onSelect,type) =>
		
		<TreeItem
			key={nodes.id}
			nodeId={nodes.id}
			label={
				<div>
					<>
						{/* <FolderOpenIcon /> {nodes.text_label} */}
						{/* <a className="cursorPointer text-decoration-none appTextColor" onClick={() => changeTitle(nodes.text_label)}> */}
						{type === "selectFolder" && <a className="cursorPointer text-decoration-none appTextColor">
							<img src={FolderIcon} className={classes.folderIcon} /> <span className={classes.projectTitle + ' ' + (defaultTitleId === nodes.id ? classes.projTitleActive : '')} title={nodes.text_label}>{showString(nodes.text_label)}</span></a>
						}
						{type === "moveFolder" && <a className="cursorPointer text-decoration-none appTextColor">
							<img src={FolderIcon} className={classes.folderIcon} /> <span className={classes.projectTitle + ' ' + (moveFolderId === nodes.id ? classes.projTitleActive : '')} title={nodes.text_label}>{showString(nodes.text_label)}</span></a>
						}
					</>
				</div>
			}
			onLabelClick={() => {
				console.log(nodes,'nodes');
				onSelect(nodes.id, nodes.text_label);
				setSelectTitle(nodes.text_label);
				if(type === "selectFolder")
				{
					parentCallback(nodes);
				}else if(type === "moveFolder"){
					moveFolderCallback(nodes);

				}	
				
			}}
			onIconClick={() => {
				onSelect(nodes.id, nodes.text_label)
				setSelectTitle(nodes.text_label);
				if(type === "selectFolder")
				{
					parentCallback(nodes);
				}else if(type === "moveFolder"){
					moveFolderCallback(nodes);
				}
			}}
		>
			{Array.isArray(nodes.children)
				? nodes.children.map(node => renderTree(node, onSelect,type))
				: null}
		</TreeItem>
		
		

	initialValues["yellow"] = items.text_label;

	return (
		<Formik className={classes.root} initialValues={initialValues}>
			{props => (
				<>
					<Tree
						data={items}
						setFieldValue={props.setFieldValue}
						renderTree={renderTree}
						type={type}
						expandedIds={expandedIds}
						infoFolderIds = {infoFolderIds}
					/>
					{/* <pre>{JSON.stringify(props.values, null, 2)}</pre> */}
				</>
			)}
		</Formik>
	);
};

export default FolderTreeMenu;

const Tree = props => {
	return (
		<>
			{props.type === "selectFolder" && props.infoFolderIds.length == 0 && <TreeView
				// defaultCollapseIcon={<ExpandMoreIcon />}
				// defaultExpanded={["My Searches"]}
				defaultExpanded={props.expandedIds}
				// expanded={props.infoFolderIds}
				// defaultExpandIcon={<ChevronRightIcon />}
				// multiSelect
				>
				{props.renderTree(props.data, props.setFieldValue,props.type)}
				</TreeView>
			}
			{props.type === "selectFolder" && props.infoFolderIds.length > 0 && <TreeView
				// defaultCollapseIcon={<ExpandMoreIcon />}
				// defaultExpanded={["My Searches"]}
				defaultExpanded={props.expandedIds}
				expanded={props.infoFolderIds}
				// defaultExpandIcon={<ChevronRightIcon />}
				// multiSelect
				>
				{props.renderTree(props.data, props.setFieldValue,props.type)}
				</TreeView>
			}
			{props.type === "moveFolder" && <TreeView
				// defaultCollapseIcon={<ExpandMoreIcon />}
				// defaultExpanded={["root"]}
				// defaultExpanded={props.expandedIds}
				expanded={props.expandedIds}
				// defaultExpandIcon={<ChevronRightIcon />}
				// multiSelect
				>
				{props.renderTree(props.data, props.setFieldValue,props.type)}
				</TreeView>
			}
			<pre>{JSON.stringify(props.values, null, 2)}</pre>
		</>
	);
};

