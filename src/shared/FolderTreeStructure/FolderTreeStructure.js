import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
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
  // '& .MuiCheckbox-colorSecondary.Mui-checked':{
  //   color: "#007bff !important"
  // }
});

const FolderTreeStructure = ({treeData, parentCallBack, dbName}) => {
    console.log('treeData', treeData)
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  console.log('files', files)

  const renderTree = (nodes, onSelect, dbName) =>
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={
          <div>
            { nodes.type === "seqdb" ? (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="file"
                      onChange={e => {
                        onSelect(nodes.label, e.target.checked);
                        parentCallBack(nodes.id, dbName)
                      }}
                    />
                  }
                label={nodes.label}
                  key={nodes.id}
                />
              </>
            ) : null}
             { nodes.type === "folder" ? (
              <span>
                 {nodes.label}
              </span>
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
          ? nodes.children.map(node => renderTree(node, onSelect, dbName))
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
      >
        {props.renderTree(props.data, props.setFieldValue, props.dbName)}
      </TreeView>
      {/* <pre>{JSON.stringify(props.values, null, 2)}</pre> */}
    </>
  );
};
