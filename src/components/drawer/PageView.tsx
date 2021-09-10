import {Box, Button, FormControl, FormLabel, Input, Stat, StatHelpText, StatLabel, StatNumber,} from "@chakra-ui/react";
import React, {useState} from "react";
import BPageService from "../../services/BPageService";
import BPage from "../../services/Page";

type Props = {
    changeTab: any;
    page: BPage;
    setPage: any;
}
export default function PageView({changeTab, page, setPage}: Props) {
    const [pageTitle, setPageTitle] = useState(page.title);
    const [pageId, setPageId] = useState(page.id);

    let date;
    if(typeof page.modified === "string") {
        date = new Date(page.modified)
    }
    else {
        date = new Date();
    }

    const modTime = ("0" + date.getHours()).slice(-2) + ":" +
        ("0" + date.getMinutes()).slice(-2) + ":" +
        ("0" + date.getSeconds()).slice(-2);
    const modDate = date.toDateString();

    if(pageId != page.id) {
        setPageId(page.id);
        setPageTitle(page.title);
    }

    const save = () => {
        page.title = pageTitle;
        BPageService.update(page);
        setPage(page);
        changeTab(0);
    }

    return(
        <>
            <Box p={4}>
                <FormControl id="title" isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                        type="text"
                        value={pageTitle}
                        size="lg"
                        onChange={(e) => { console.log(e); setPageTitle(e.currentTarget.value)}}
                    />
                </FormControl>
            </Box>
            <Box p={4}>
                <Stat>
                    <StatLabel>Last updated</StatLabel>
                    <StatNumber>{modDate}</StatNumber>
                    <StatHelpText>{modTime}</StatHelpText>
                </Stat>
            </Box>
            <Box p={4}>
                <Stat>
                    <StatLabel>ID</StatLabel>
                    <StatNumber>{page.id}</StatNumber>
                </Stat>
            </Box>
            <Box p={4}>
                <FormControl>
                    <Button variant="outline" mr={3} onClick={(e) => changeTab(0)}>Cancel</Button>
                    <Button colorScheme="blue" onClick={() => save()}>Save</Button>
                </FormControl>
            </Box>
        </>
    )
}