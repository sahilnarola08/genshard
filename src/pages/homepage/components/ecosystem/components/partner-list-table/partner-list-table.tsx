import React from 'react'
import "./partner-list-table.sass";
import partnerTableIcon from '../../../../../../images/ecosystem/partner-table-icon.svg'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Avatar } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { RadioDropdown } from '../../../../../accelerate-pages/vc-dashboard/components/radio-dropdown/radio-dropdown';

interface Column {
    id: 'name' | 'type' | 'description' | 'socials' | 'density';
    label: string;
    minWidth?: number;
}

const columns: readonly Column[] = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'type', label: 'Type', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 170 },
    { id: 'socials', label: 'Socials', minWidth: 170 },
];

interface Data {
    image: string;
    name: string;
    type: string;
    description: string;
}

function createData(
    image: string,
    name: string,
    type: string,
    description: string,
): Data {
    return { image, name, type, description };
}

const rows = [
    createData(partnerTableIcon, "Lorem Ipsum", 'Gaming', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'),
    createData(partnerTableIcon, "Lorem Ipsum", 'Gaming', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'),
    createData(partnerTableIcon, "Lorem Ipsum", 'Gaming', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'),
    createData(partnerTableIcon, "Lorem Ipsum", 'Gaming', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'),
    createData(partnerTableIcon, "Lorem Ipsum", 'Gaming', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'),
    createData(partnerTableIcon, "Lorem Ipsum", 'Gaming', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'),
    createData(partnerTableIcon, "Lorem Ipsum", 'Gaming', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'),
    createData(partnerTableIcon, "Lorem Ipsum", 'Gaming', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'),
    createData(partnerTableIcon, "Lorem Ipsum", 'Gaming', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'),
    createData(partnerTableIcon, "Lorem Ipsum", 'Gaming', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'),
    createData(partnerTableIcon, "Lorem Ipsum", 'Gaming', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'),
];

const dropdownData = [
    {
        btnName: "Area",
        dropdown: [
            "Area",
            "Area",
            "Area",
        ]
    },
    {
        btnName: "Connect Status",
        dropdown: [
            "Connected",
            "Requested",
            "Not Connected",
        ]
    },
]

const PartnerListTable = () => {

    const location = useLocation();
    const pathname = location.pathname;
    const isProjectDashboard = pathname.includes("/project-dashboard")

    return (
        <>
            {isProjectDashboard &&
                <div className="table-filter-content">
                    <div className="heading-table">
                        <p className='paragraph-new fw-bold mb-0'>Filter List by</p>
                        {dropdownData && dropdownData.map((item: any, index: number) => (
                            <RadioDropdown
                                key={index}
                                BtnName={item.btnName}
                                dropdownValues={item.dropdown}
                            />
                        ))}
                    
                    </div>
                </div>
            }

            <div className="partner-list-data">
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                    {/* {isProjectDashboard &&
                                        <TableCell className=''>
                                            <p className='paragraph-new-medium table-description mb-0'>Status</p>
                                        </TableCell>
                                    } */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows?.map((row) => {
                                    return (
                                        <TableRow style={{ fontSize: '4rem' }} key={row.name}>
                                            <TableCell >
                                                <div className='d-flex align-items-center'>
                                                    <Avatar alt="Remy Sharp" className='img-fluid mt-0' src={row.image} />
                                                    <p className='paragraph-new-medium mb-0 ms-2 mt-0'>{row.name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell><p className='paragraph-new-medium mb-0 ms-2 mt-0'>{row.type}</p></TableCell>
                                            <TableCell className=''>
                                                <p className='paragraph-new-medium table-description mb-0'>{row.description}</p>
                                            </TableCell>
                                            <TableCell >
                                                <ul className='social-link-table'>
                                                    <li>
                                                        <a href="#"><i className="ri-twitter-fill"></i></a>
                                                    </li>
                                                    <li>
                                                        <a href="#"><i className="ri-links-line"></i></a>
                                                    </li>
                                                    <li>
                                                        <a href="#"><i className="ri-send-plane-fill"></i></a>
                                                    </li>
                                                </ul>
                                            </TableCell>
                                            {/* {isProjectDashboard &&
                                                <TableCell className='' style={{ width: "190px" }}>
                                                    <button className='request-to-onnect-btn'>Request to Connect</button>
                                                </TableCell>
                                            } */}
                                        </TableRow>
                                    )
                                }
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>
            </div>
        </>
    );
};

export default PartnerListTable;
