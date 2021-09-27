import './PageList.css'
import React, {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Grid,
    GridItem,
    HStack,
    SimpleGrid,
    Text,
    Tooltip,
    useColorModeValue
} from "@chakra-ui/react"
import BPageService from "../../services/BPageService";
import BPage from "../../services/Page";
import {DeleteIcon} from "@chakra-ui/icons";
import {useContext, useRef, useState} from "react";
import {useEthers} from "@usedapp/core";
import {EditorContext} from "../../editor-context";

type Props = {
    changeTab: any;
}

export default function PageList({changeTab}: Props) {
    const {account} = useEthers();
    const data = BPageService.getAll(account);
    const [, setPages] = useState(data);
    const [isOpen, setIsOpen] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState(0);
    const {page, setPage} = useContext(EditorContext)

    const onClose = () => {
        setIsOpen(false);
        setDeleteCandidate(0);
    }

    const cancelRef = useRef();

    const handleEditPage = (id) => {
        const pg = BPageService.get(account, id)
        if(pg !== undefined) {
            setPage(pg);
            changeTab(1);
            console.log("Loaded page " + id);
            console.log(pg);
        }

        console.log("Edit " + id);
    }

    const handleSelectPage = (id) => {
        const pg = BPageService.get(account, id)
        if(pg !== undefined) {
            setPage(pg);
            console.log("Loaded page " + id);
            console.log(pg);
        }

        console.log("Select " + id);
    }

    const handleConfirmDelete = (id) => {
        setDeleteCandidate(id);
        setIsOpen(true);
    }

    const handleDelete = () => {
        if(deleteCandidate > 0) {
            const deleted = BPageService.remove(account, deleteCandidate);
            if(deleted) {
                console.log("Deleted " + deleteCandidate);
                if(page.id === deleteCandidate) {
                    let pg = BPageService.latest(account);
                    setPage(pg);
                }
                else {
                    setPages(BPageService.getAll(account))
                }
            }
        }
        onClose();
    }

    const activeRowBackgroundColor = useColorModeValue("blue.100", "gray.600");
    const activeRowForegroundColor = useColorModeValue("blue.700", "gray.200");
    const activeRowHover = {
        backgroundColor: useColorModeValue("gray.300", "gray.600"),
        color: useColorModeValue("gray.500", "gray.200"),
    }

    const inactiveRowBackgroundColor = useColorModeValue("gray.50", "gray.700");
    const inactiveRowForegroundColor = useColorModeValue("blue.700", "");
    const inactiveRowHover = {
        backgroundColor: useColorModeValue("blue.300", "cyan.700"),
        color: useColorModeValue("gray.700", "blue.200"),
        cursor: "pointer"
    }

    const buttonColorHover = useColorModeValue("blue.700", "gray.200")

    const ResponsiveDate = ({d}: DateProps) => {
        let date;
        let dayStart = new Date();
        dayStart.setHours(0, 0, 0, 0);

        if (typeof d === "string") {
            date = new Date(d);
        } else {
            date = new Date();
        }

        if (date.getTime() < dayStart.getTime()) {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const m = date.getMonth() - 1;
            return (
                <Text textTransform={"uppercase"} fontSize={"xs"}>{date.getDay()} {months[m]} {date.getFullYear()}</Text>
            )
        }

        let hrs = date.getHours()
        let ampm;
        if (hrs < 12) {
            if(hrs === 0) hrs = 12;
            ampm = "am";
        } else {
            if(hrs !== 12) {
                hrs = hrs - 12;
            }
            ampm = "pm";
        }

        return (
            <HStack spacing={"4px"}>
                <Text fontSize={"xs"} textTransform={"uppercase"}>Today, {("0" + hrs).slice(-2)}:{("0" + date.getMinutes()).slice(-2)}</Text>
                <Text fontSize={"xs"} textTransform={"uppercase"}>{ampm}</Text>
            </HStack>
        )
    }

    return (
        <>
            <SimpleGrid>
                {Array.from(data.values()).map((value: BPage, key: number) => {

                    let rowHover, rowBackground, rowColor;
                    if (page.id === value.id) {
                        rowBackground = activeRowBackgroundColor;
                        rowColor = activeRowForegroundColor;
                        rowHover = activeRowHover;
                    }
                    else {
                        rowBackground = inactiveRowBackgroundColor;
                        rowColor = inactiveRowForegroundColor;
                        rowHover = inactiveRowHover;
                    }

                    return(
                        <Grid
                            templateColumns={"repeat(5, 1fr)"}
                            key={value.id}
                            _hover={rowHover}
                            backgroundColor={rowBackground}
                            color={rowColor}
                            onClick={() => { handleSelectPage(value.id) }}
                            onDoubleClick={() => {handleEditPage(value.id)}}
                            p={[4,6]}
                        >


                            <GridItem colSpan={4} flex={1}>
                                <ResponsiveDate d={value.modified}/>
                                <Text fontSize={"xl"} isTruncated>{value.title}</Text>
                            </GridItem>

                            <GridItem textAlign={"right"}>
                                <Tooltip label={"Delete"}>
                                    <DeleteIcon
                                        alignSelf={"flex-end"}
                                        aria-label={"Actions for "+value.id}
                                        onClick={(e) => { handleConfirmDelete(value.id); e.stopPropagation(); }}
                                        d={"inline-block"}
                                        _hover={{
                                            cursor: "pointer",
                                            color: buttonColorHover,
                                        }}
                                    />
                                </Tooltip>
                            </GridItem>


                        </Grid>
                    )
                })}
            </SimpleGrid>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef.current}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Page
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef.current} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={(deleter) => { handleDelete(); }} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

type DateProps = {
    d: Date|undefined;
}


