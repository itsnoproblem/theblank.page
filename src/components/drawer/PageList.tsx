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
import {useCallback, useContext, useMemo, useState} from 'react'
import { useTable, useSortBy } from 'react-table'
import BPageService from "../../services/BPageService";
import BPage from "../../services/Page";
import {EditorContext} from "../../editor-context";

export default function PageList() {

    const { page, setPage } = useContext(EditorContext);
    const data = BPageService.getAll();

    const handleEditPage = (id) => {
        const pg = BPageService.get(id)
        if(pg !== undefined) {
            setPage(pg);
            console.log("Loaded page " + id);
            console.log(pg);
        }

        console.log("Edit " + id);
    }

    const handleSelectPage = (id) => {
        const pg = BPageService.get(id)
        if(pg !== undefined) {
            setPage(pg);
            console.log("Loaded page " + id);
            console.log(pg);
        }

        console.log("Select " + id);
    }

    return (
            <Table>
                <Tbody>
                {Array.from(data.values()).map((value: BPage, key: number) => {
                    return(
                        <Page
                            key={key}
                            title={value.title}
                            modified={value.modified}
                            id={value.id}
                            handleSelectPage={() => { handleSelectPage(value.id) }}
                            handleEditPage={() => { handleEditPage(value.id) }}
                        />
                    )
                })}
                </Tbody>
            </Table>
    )
}

type Props = {
    title: any;
    modified: any;
    id: any;
    handleSelectPage: any;
    handleEditPage: any;
}

export function Page({title, modified, id, handleSelectPage, handleEditPage}: Props) {
    return (
        <Tr _hover={{
            color: "gray.700",
            backgroundColor: "blue.300",
            cursor: "pointer",
        }} onClick={handleSelectPage}>
            <Td>{title}</Td>
            <Td>{modified}</Td>
            <Td><IconButton
                aria-label={"Edit "+id}
                icon={<EditIcon/>}
                onClick={handleEditPage}
                _hover={{
                    backgroundColor: "blue.700",
                    color: "gray.200",
                }}
            /></Td>
        </Tr>

    )
}