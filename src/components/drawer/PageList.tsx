import './PageList.css'
import React, {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    chakra,
    Button,
    IconButton
} from "@chakra-ui/react"
import {
    EditIcon,
    TriangleDownIcon,
    TriangleUpIcon
} from "@chakra-ui/icons"
import pages from '../mocks/pages'
import {useMemo} from 'react'
import { useTable, useSortBy } from 'react-table'


export default function PageList() {

    const data = useMemo(
        () => [
            {
                title: "My page",
                modified: "2021/04/03",
                id: "dcexf2",
            },
            {
                title: "the story of your toe",
                modified: "2021/04/21",
                id: "gfd466a",
            },
            {
                title: "this is a thing",
                modified: "2021/08/12",
                id: "44b26d14",
            },
        ],
        [],
    )

    const columns = useMemo(
        () => [
            {
                Header: "Title",
                accessor: "title",
            },
            {
                Header: "Last Modified",
                accessor: "modified",
            },
            {
                Header: "Actions",
                accessor: "id",
                Cell: ({ cell }) => (
                    <IconButton
                        _hover={{
                            color: "gray.700",
                            backgroundColor: "blue.300",
                        }}
                        aria-label={"edit " + cell.row.values.title}
                        icon={<EditIcon/>}
                        id={cell.row.values.id}
                        onClick={(e) => { editClick(cell.row.values.id); e.stopPropagation(); } }>
                    </IconButton>
                )
            },
        ],
        [],
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy)

    const rowClick = (id: string) => {
        console.log("rowcleeck");
        console.log(id);
    }

    const editClick = (id: string) => {
        console.log("editClick");
        console.log(id);
    }

    return (
        <Table {...getTableProps()}>
            <TableCaption>This is the table caption</TableCaption>
            <Thead>
                {headerGroups.map((headerGroup) => (
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <Th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                isActions={column.isActions}
                            >
                                {column.render("Header")}
                                <chakra.span pl="4">
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <TriangleDownIcon aria-label="sorted descending" />
                                        ) : (
                                            <TriangleUpIcon aria-label="sorted ascending" />
                                        )
                                    ) : null}
                                </chakra.span>
                            </Th>
                        ))}
                    </Tr>
                ))}
            </Thead>
            <Tbody {...getTableBodyProps()} className="page-list">
                {rows.map((row) => {
                    prepareRow(row)
                    return (
                        <Tr {...row.getRowProps()} onClick={(e) => {
                            rowClick(row.values.id);
                            return e.stopPropagation();
                        }}
                            _hover={{
                                backgroundColor: "blue.700",
                                color: "gray.300"
                            }}
                        >
                            {row.cells.map((cell) => (
                                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                                    {cell.render("Cell")}
                                </Td>
                            ))}
                        </Tr>
                    )
                })}
            </Tbody>
            {/*<Tbody>*/}
            {/*    {pages.map((pg, i) => (*/}
            {/*        <Page id={pg.id} title={pg.title} modified={pg.modified}/>*/}
            {/*    ))}*/}
            {/*</Tbody>*/}
            <Tfoot>
                <Tr>
                    <Th></Th>
                    <Th></Th>
                    <Th></Th>
                </Tr>
            </Tfoot>
        </Table>
    )
}

type Props = {
    title: any;
    modified: any;
    id: any;
}

export function Page({title, modified, id}: Props) {
    return (
        <Tr>
            <Td>{title}</Td>
            <Td>{modified}</Td>
            <Td><EditIcon/></Td>
        </Tr>

    )
}