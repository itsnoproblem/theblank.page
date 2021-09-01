import React, {Input, InputGroup, InputLeftElement,} from "@chakra-ui/react"
import {SearchIcon} from "@chakra-ui/icons"
import PageList from "./PageList";

type Props = {
    active: boolean;
}
export default function AccountPages({active}: Props) {
    return(
        <div>
            <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    children={<SearchIcon color="gray.300" />}
                />
                <Input type="text" placeholder="Search" />
            </InputGroup>
            <PageList/>
        </div>
    )
}
