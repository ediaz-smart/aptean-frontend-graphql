import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MaterialTreeItem from "@material-ui/lab/TreeItem";
import { Formik, useField } from "formik";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/FolderOpenTwoTone";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import MemoryIcon from "@material-ui/icons/Memory";
import BlurCircularIcon from "@material-ui/icons/BlurCircular";

const initialValues = {};

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400
  },
  folderPadding: {
    padding: "5px",
    // margin: "0px !important"
  },
  // '& .MuiCheckbox-colorSecondary.Mui-checked':{
  //   color: "#007bff !important"
  // }


});

const TreeItem = withStyles({
	root: {
		"&.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label": {
			backgroundColor: '#fff !important'
		}
	}
})(MaterialTreeItem);


const FolderTreeStructure = ({ treeData, parentCallBack, dbName, dataArray, seQValue }) => {
  const classes = useStyles();
  const [files, setFiles] = useState([]);

  const renderTree = (nodes, onSelect, dbName, dataArray, seQValue) =>
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <div>
          {nodes.type === "seqdb" ? (
            <>
              {dataArray && <FormControlLabel
                control={
                  <Checkbox
                    name="file"
                    checked={dataArray.includes(nodes.id)}
                    onChange={e => {
                      onSelect(nodes.label, e.target.checked);
                      parentCallBack(nodes.id, dbName)
                    }}
                    disabled={seQValue == dbName ? false : true}
                    color="primary"
                  />
                }
                label={nodes.label}
                key={nodes.id}
              />
              }
              {!dataArray && <FormControlLabel
                control={
                  <Checkbox
                    name="file"
                    onChange={e => {
                      onSelect(nodes.label, e.target.checked);
                      parentCallBack(nodes.id, dbName)
                    }}
                    color="primary"
                  />
                }
                label={nodes.label}
                key={nodes.id}
              />
              }
            </>
          ) : null}
          {nodes.type === "folder" ? (
            <div className={classes.folderPadding}>
              {nodes.label}
            </div>
          ) : null}
        </div>
      }
    // onLabelClick={() => {
    // console.log('nodes.label', nodes.label)
    // onSelect(nodes.type, nodes.label);
    // parentCallBack(nodes.id, dbName)
    // }}
    // onIconClick={() => {
    // onSelect(nodes.type, nodes.label)
    // parentCallBack(nodes.id, dbName)
    // }}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map(node => renderTree(node, onSelect, dbName, dataArray, seQValue))
        : null}
    </TreeItem>
  // );

  //   initialValues["yellow"] = data.name;

  return (
    <Formik className={classes.root} initialValues={initialValues}>
      {props => (
        <>
          <Tree
            data={treeData}
            setFieldValue={props.setFieldValue}
            renderTree={renderTree}
            dbName={dbName}
            dataArray={dataArray}
            seQValue={seQValue}
          />
          {/* <pre>{JSON.stringify(props.values, null, 2)}</pre> */}
        </>
      )}
    </Formik>
  );

};

export default FolderTreeStructure;

const Tree = (props) => {
  return (
    <>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={["root"]}
        defaultExpandIcon={<ChevronRightIcon />}
        multiSelect
        dbName
        dataArray
        seQValue
      >
        {props.renderTree(props.data, props.setFieldValue, props.dbName, props.dataArray, props.seQValue)}
      </TreeView>
      {/* <pre>{JSON.stringify(props.values, null, 2)}</pre> */}
    </>
  );
};
