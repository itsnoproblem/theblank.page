import './PageList.css'
import React, {
    SimpleGrid,
    Text,
    Grid,
    HStack,
    Box,
    useColorModeValue,
    IconButton,
    AlertDialog,
    AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button
} from "@chakra-ui/react"
import BPageService from "../../services/BPageService";
import BPage from "../../services/Page";
import {ChevronDownIcon, DeleteIcon} from "@chakra-ui/icons";
import {useState, useRef} from "react";

type Props = {
    changeTab: any;
    page: BPage;
    setPage: any;
}

export default function PageList({changeTab, page, setPage}: Props) {
    const data = BPageService.getAll();
    const [pages, setPages] = useState(data);
    const [isOpen, setIsOpen] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState(0);

    const onClose = () => {
        setIsOpen(false);
        setDeleteCandidate(0);
    }

    const cancelRef = useRef();

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

    const handleConfirmDelete = (id) => {
        setDeleteCandidate(id);
        setIsOpen(true);
    }

    const handleDelete = () => {
        if(deleteCandidate > 0) {
            const deleted = BPageService.remove(deleteCandidate);
            if(deleted) {
                console.log("Deleted " + deleteCandidate);
                if(page.id === deleteCandidate) {
                    let pg = BPageService.latest();
                    setPage(pg);
                }
                else {
                    setPages(BPageService.getAll())
                }
            }
        }
        onClose();
    }

    const activeRowBackgroundColor = useColorModeValue("blue.200", "gray.600");
    const activeRowForegroundColor = useColorModeValue("blue.700", "gray.200");
    const activeRowHover = {
        backgroundColor: useColorModeValue("gray.300", "gray.600"),
        color: useColorModeValue("gray.500", "gray.200"),
    }

    const inactiveRowBackgroundColor = useColorModeValue("blue.100", "gray.700");
    const inactiveRowForegroundColor = useColorModeValue("blue.700", "");
    const inactiveRowHover = {
        backgroundColor: useColorModeValue("blue.200", "cyan.700"),
        color: useColorModeValue("blue.500", "blue.200"),
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
                <Text>{date.getDay()} {months[m]} {date.getFullYear()}</Text>
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
                <Text fontSize="sm">Today, {("0" + hrs).slice(-2)}:{("0" + date.getMinutes()).slice(-2)}</Text>
                <Text fontSize="sm" textTransform={"uppercase"}>{ampm}</Text>
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
                            key={value.id}
                            templateColumns={"repeat(3, 1fr)"}
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
                            <Box p={4} pt={6} align={"right"}>
                                <ResponsiveDate d={value.modified}/>
                            </Box>
                            <Text p={4} align={"right"}>
                                <DeleteIcon
                                    alignSelf={"flex-end"}
                                    // icon={(<DeleteIcon/>)}
                                    aria-label={"Actions for "+value.id}
                                    onClick={(e) => { handleConfirmDelete(value.id); e.stopPropagation(); }}
                                    // hidden={(page.id == value.id)}
                                    d={"inline-block"}
                                    _hover={{
                                        cursor: "pointer",
                                        color: buttonColorHover,
                                    }}
                                />
                            </Text>

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

