import './PageList.css'
import {useContext} from 'react'
import React, {IconButton, SimpleGrid, Text, Grid} from "@chakra-ui/react"
import {EditIcon} from "@chakra-ui/icons"
import {EditorContext} from "../../editor-context";
import BPageService from "../../services/BPageService";
import BPage from "../../services/Page";

type Props = {
    changeTab: any;
    page: BPage;
    setPage: any;
}

export default function PageList({changeTab, page, setPage}: Props) {

    const data = BPageService.getAll();

    const handleEditPage = (id) => {
        const pg = BPageService.get(id)
        if(pg !== undefined) {
            setPage(pg);
            changeTab(1);
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
            <SimpleGrid>
                {Array.from(data.values()).map((value: BPage, key: number) => {
                    const responsiveDate = (d: Date|undefined) => {
                        let date;
                        let dayStart = new Date();
                        dayStart.setHours(0,0,0,0);

                        if(typeof d === "string") {
                            date = new Date(d)
                        }
                        else {
                            date = new Date();
                        }

                        if(date.getTime() < dayStart.getTime()) {
                            const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            const m = date.getMonth() - 1;
                            return date.getDay() + " " + months[m] + " " + date.getFullYear();
                        }

                        return date.getHours() + ":" + date.getMinutes();
                    }

                    let rowHover, rowBackground, rowColor;
                    if (page.id === value.id) {
                        rowBackground = "gray.600";
                        rowColor = "gray.900";
                        rowHover = {}
                    }
                    else {
                        rowBackground = "gray.700";
                        rowColor = "gray.400";
                        rowHover = {
                            backgroundColor: "gray.600",
                            color: "blue.200",
                            cursor: "pointer"
                        }
                    }

                    return(
                        <Grid
                            key={value.id}
                            templateColumns={"repeat(2, 1fr)"}
                            borderRadius={"sm"}
                            alignItems={"space-between"}
                            justifyContent={"center"}
                            _hover={rowHover}
                            backgroundColor={rowBackground}
                            color={rowColor}
                            onClick={() => { handleSelectPage(value.id) }}
                            onDoubleClick={() => {handleEditPage(value.id)}}
                        >
                            <Text p={4} pt={6} isTruncated>{value.title}</Text>
                            <Text p={4} pt={6} align={"right"}>{responsiveDate(value.modified)}</Text>
                            {/*<Text p={4} align={"right"}>*/}
                            {/*    <IconButton*/}
                            {/*        alignSelf={"flex-end"}*/}
                            {/*        aria-label={"Edit "+value.id}*/}
                            {/*        icon={<EditIcon/>}*/}
                            {/*        onClick={handleEditPage}*/}
                            {/*        hidden={(page.id == value.id)}*/}
                            {/*        d={"inline-block"}*/}
                            {/*        _hover={{*/}
                            {/*            backgroundColor: "blue.700",*/}
                            {/*            color: "gray.200",*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</Text>*/}

                        </Grid>
                    )
                })}
            </SimpleGrid>
    )
}
