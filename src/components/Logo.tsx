import React from "react";
import {Box, Tooltip, useBreakpointValue} from '@chakra-ui/react'
import {useTheme} from "@emotion/react";

type Props = {
    onClick: any,

}

export default function Logo({onClick}: Props) {
    const isDesktop = useBreakpointValue({sm: false, md: false, lg: true})
    return(
        <Box data-testid={"menu"} cursor={"pointer"} onClick={onClick} className="logo" mt={2}>
            <Tooltip  isDisabled={!isDesktop} label={"menu"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="feather feather-book-open">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
            </Tooltip>
        </Box>
    )
}