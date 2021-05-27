import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import MuiTreeItem from "@material-ui/lab/TreeItem";
import { Formik, useField } from "formik";
import FolderIcon from '../../assets/image/folder.svg';

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

const FolderTreeMenu = ({ items, parentCallback, selectedTitle }) => {
	const classes = useStyles();
	const [defaultTitle, setDefaultTitle] = useState('');
	// console.log(items,'items');
	// console.log(parentCallback,'parentCallback');
	items.text_label = 'My Searches';
	useEffect(() => {
		setDefaultTitle(selectedTitle);
	});
	function showString(str){
        let getLength = str.length;
        if(getLength > 23){
            str = str.substring(0,23)+' ...';
        }
        return str;
        
    }
	const renderTree = (nodes, onSelect) =>
		<TreeItem
			key={nodes.id}
			nodeId={nodes.id}
			label={
				<div>
					<>
						{/* <FolderOpenIcon /> {nodes.text_label} */}
						{/* <a className="cursorPointer text-decoration-none appTextColor" onClick={() => changeTitle(nodes.text_label)}> */}
						<a className="cursorPointer text-decoration-none appTextColor">
							<img src={FolderIcon} className={classes.folderIcon} /> <span className={classes.projectTitle + ' ' + (defaultTitle === nodes.text_label ? classes.projTitleActive : '')} title={nodes.text_label}>{nodes.text_label}</span></a>
					</>
				</div>
			}
			onLabelClick={() => {
				onSelect(nodes.id, nodes.text_label);
				console.log(nodes.text_label, 'nodes.text_label');
				parentCallback(nodes);
			}}
			onIconClick={() => {
				onSelect(nodes.id, nodes.text_label)
				parentCallback(nodes);
			}}
		>
			{Array.isArray(nodes.children)
				? nodes.children.map(node => renderTree(node, onSelect))
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
			<TreeView
				// defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpanded={["root"]}
			// defaultExpandIcon={<ChevronRightIcon />}
			// multiSelect
			>
				{props.renderTree(props.data, props.setFieldValue)}
			</TreeView>
			{/* <pre>{JSON.stringify(props.values, null, 2)}</pre> */}
		</>
	);
};

