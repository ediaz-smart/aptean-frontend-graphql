import React from "react";
import { useTable } from "react-table";
import styled from 'styled-components'

import "./Table.css";

const Styles = styled.div`
  /* This is required to make the table full-width */
  display: block;
  max-width: 100%;

  /* This will make the table scrollable when it gets too small */
  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
	color:#5A6868;
  }

  table {
    /* Make sure the inner table is always as wide as needed */
    width: 100%;
    border-spacing: 0;
	:last-child {
		border-bottom: 0;
	}
    tr {
		border-bottom: 1px solid #cec7c7;

		:first-child {
			border-bottom: 0;
		}
		
    }

    th{
		margin: 0;
		//padding: 0.5rem;
		border-bottom: 1px solid #cec7c7;
		border-right: 1px solid #cec7c7;
  
		/* The secret sauce */
		/* Each cell should grow equally */
		width: 1%;
		/* But "collapsed" cells should be as small as possible */
		&.collapse {
		  width: 0.0000000001%;
		}
		:first-child {
			border-bottom: 0;
		}
		:last-child {
		  border-right: 0;
		}
	},
    td {
      margin: 0;
     // padding: 0.5rem;
      border-bottom: 1px solid #cec7c7;
      border-right: 1px solid #cec7c7;

      /* The secret sauce */
      /* Each cell should grow equally */
      width: 1%;
      /* But "collapsed" cells should be as small as possible */
      &.collapse {
        width: 0.0000000001%;
      }

      :last-child {
        border-right: 0;
      }
    }
  }`

export default function Table({ columns, data }) {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow
	} = useTable({
		columns,
		data
	});

	console.log(headerGroups,'headerGroup');
	// delete headerGroups[0];
	console.log(headerGroups,'headerGroupsss');
	return (
		<Styles>
			<table className="w-100 borderless tableWrap" {...getTableProps()}>
				<thead >
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps()}>{column.render("Header")}</th>
							))}
						</tr>
					))}
				</thead>
				<tbody  {...getTableBodyProps()}>
					{rows.map((row, i) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map(cell => {
									return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</Styles>

	);
}
