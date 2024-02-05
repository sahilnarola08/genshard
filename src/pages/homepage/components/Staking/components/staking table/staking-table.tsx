import React from 'react'
import "./staking-table.sass"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
const Stakingtable = () => {
    interface Data {
        rank: number;
        address: string;
        stakedAmount: string;
        ofthepoolowned: string;
        id: number;
    }

    interface ColumnData {
        dataKey: keyof Data;
        label: string;
        numeric?: boolean;
        width: number;
    }

    type Sample = [number, string, string, string];

    const sample: readonly Sample[] = [
        [1, "0xssjaspisasduosnef2390239fj20erfj209dwj2w83jc923", "$382,229", "9.1%"],
        [2, "0xssjaspisasduosnef2390239fj20erfj209dwj2w83jc923", "$382,229", "5%"],
        [3, "0xssjaspisasduosnef2390239fj20erfj209dwj2w83jc923", "$382,229", "3.1%"],
        [4, "0xssjaspisasduosnef2390239fj20erfj209dwj2w83jc923", "$382,229", "0.25%"],
        [5, "0xssjaspisasduosnef2390239fj20erfj209dwj2w83jc923", "$382,229", "0.25%"],
    ];

    function createData(
        id: number,
        rank: number,
        address: string,
        stakedAmount: string,
        ofthepoolowned: string,
    ): Data {
        return { id, rank, address, stakedAmount, ofthepoolowned };
    }

    const columns: ColumnData[] = [
        {
            width: 80,
            label: 'Rank',
            dataKey: 'rank',
            numeric: true,
        },
        {
            width: 200,
            label: 'Address',
            dataKey: 'address',
            numeric: true,
        },
        {
            width: 100,
            label: 'Staked Amount',
            dataKey: 'stakedAmount',
            numeric: true,
        },
        {
            width: 120,
            label: '% of the pool owned',
            dataKey: 'ofthepoolowned',
            numeric: true,
        },
    ];

    const rows: Data[] = Array.from({ length: 200 }, (_, index) => {
        const randomSelection = sample[Math.floor(Math.random() * sample.length)];
        return createData(index, ...randomSelection);
    });

    const VirtuosoTableComponents: TableComponents<Data> = {
        Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
            <TableContainer component={Paper} {...props} ref={ref} />
        )),
        Table: (props) => (
            <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
        ),
        TableHead,
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
        TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
            <TableBody {...props} ref={ref} />
        )),
    };

    function fixedHeaderContent() {
        return (
            <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.dataKey}
                        variant="head"
                        align={column.numeric || false ? 'left' : 'left'}
                        style={{ width: column.width }}
                        sx={{
                            backgroundColor: 'background.paper',
                        }}
                    >
                        {column.label}
                    </TableCell>
                ))}
            </TableRow>
        );
    }

    function rowContent(_index: number, row: Data) {
        return (
            <React.Fragment>
                {columns.map((column) => (
                    <TableCell
                        key={column.dataKey}
                        align={column.numeric || false ? 'left' : 'left'}
                    >
                        {row[column.dataKey]}
                    </TableCell>
                ))}
            </React.Fragment>
        );
    }
    return (
        <>
            <div className="staking-table">
                <Paper style={{ height: 400, width: '100%' }}>
                    <TableVirtuoso
                        data={rows}
                        components={VirtuosoTableComponents}
                        fixedHeaderContent={fixedHeaderContent}
                        itemContent={rowContent}
                    />
                </Paper>
            </div>
        </>
    )
}

export default Stakingtable