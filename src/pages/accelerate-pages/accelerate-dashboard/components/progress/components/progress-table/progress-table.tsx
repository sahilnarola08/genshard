import React from 'react'
import "./progress-table.sass";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface createModalProps {
    tableData: any,
    tableColumn: any,
}

const ProgressTable = ({ tableData, tableColumn }: createModalProps) => {

    return (
        <div className="progress-table-data">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {tableColumn.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData?.map((row: any, i: number) => {
                                return (
                                    <TableRow key={i}>
                                        {row.date && <TableCell style={{width: "120px"}}>{row.date}</TableCell>}
                                        {row.area && <TableCell>{row.area}</TableCell>}
                                        {row.update && <TableCell>{row.update}</TableCell>}
                                        {row.docs && <TableCell>{row.docs}</TableCell>}
                                        {row.mentorName && <TableCell style={{width: "150px"}}>{row.mentorName}</TableCell>}
                                        {row.feedback && <TableCell>{row.feedback}</TableCell>}
                                    </TableRow>
                                )
                            }
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Paper>
        </div>
    );
};

export default ProgressTable;
