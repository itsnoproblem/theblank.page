import {Button} from "@chakra-ui/react";
import React from "react";

export default function PageView() {
    const  onClose = () => {
        console.log("boop");
    }

    return(
        <>
            <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
        </>
    )
}