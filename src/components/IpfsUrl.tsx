import {HStack, IconButton, Kbd, Link, Tooltip, useClipboard} from "@chakra-ui/react";
import {ImCopy} from "react-icons/all";
import env from 'react-dotenv';

type Props = {
    hash: string
}

export const IpfsLink = ({ hash }: Props) => {
    const IPFS_GATEWAY = env.IPFS_GATEWAY;
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
                <Tooltip label={hasCopied ? "Copied!" : "Copy CID"} placement={"top-start"} closeDelay={250}>
                    <IconButton aria-label={"Copy CID"} size="xs" onClick={onCopy} icon={<ImCopy/>}/>
                </Tooltip>
            </HStack>
        }
            {!hash &&
                <Kbd>---</Kbd>
            }
        </>
    )
}