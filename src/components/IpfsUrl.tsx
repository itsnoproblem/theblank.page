import {HStack, IconButton, Kbd, Link, useClipboard} from "@chakra-ui/react";
import {ImCopy} from "react-icons/all";

type Props = {
    hash: string
}

export const IpfsLink = ({ hash }: Props) => {
    const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';
    const {onCopy, hasCopied} = useClipboard(hash ?? '')
    return (
        <>
        {hash &&
            <HStack>
                <Kbd>
                    <Link color="blue.300"
                          target="_blank"
                          href={IPFS_GATEWAY + hash}
                          _hover={{
                              textDecoration: "none",
                              color: "yellow.400",
                          }}
                    >ipfs://{hash}</Link>
                </Kbd>
                <IconButton aria-label={"Copy CID"} size="xs" icon={<ImCopy/>}/>
            </HStack>
        }
        </>
    )
}