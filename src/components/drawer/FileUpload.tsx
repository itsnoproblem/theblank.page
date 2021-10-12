import React, {useContext, useState} from 'react';
import ImageUploading from 'react-images-uploading';
import {
    Box,
    HStack,
    IconButton,
    Image,
    Spinner,
    VStack,
    useClipboard,
    Tooltip,
    useColorModeValue
} from "@chakra-ui/react";
import {ImBin2, ImQrcode} from "react-icons/all";
import {EditorContext} from "../../editor-context";
import env from 'react-dotenv';

type Props = {
    onUpload: (hash: string) => void;
    onRemove: () => void;
}

export const FileUpload = ({onUpload, onRemove}: Props) => {
    const {page, setPage} = useContext(EditorContext)
    const [images, setImages] = useState([]);
    const [pageId, setPageId] = useState(page.id);
    const { hasCopied, onCopy } = useClipboard(page._ipfsHashMetadata ?? '');
    const [imageIsUploading, setImageIsUploading] = useState(false)
    const ipfsGateway = env.IPFS_GATEWAY;
    const pinataApiUrl = env.PINATA_API_URL;


    if(pageId !== page.id) {
        setPageId(page.id);
        setImages([]);
    }

    const handleRemoveImage = (e) => {
        console.log("remove image", e);
        setImages([]);
        onRemove();
    }

    const handleImageUpload = (imageList, addUpdateIndex) => {
        if (imageList[0] !== undefined) {
            setImageIsUploading(true);
            console.log(imageList, addUpdateIndex);
            const axios = require('axios');
            const FormData = require('form-data');
            const image = imageList[0];
            const url = pinataApiUrl + 'pinning/pinFileToIPFS';
            const formData = new FormData();

            setImages(imageList);

            // const fileContents = await image['data_url'];

            formData.append('file', image['file'], image['file'].name);

            axios
                .post(url, formData, {
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                        pinata_api_key: env.PINATA_API_KEY,
                        pinata_secret_api_key: env.PINATA_API_SECRET
                    }
                })
                .then(function (response) {
                    onUpload(response.data.IpfsHash);
                    setImageIsUploading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setImageIsUploading(false);
                });
            onUpload(page._ipfsHashImage);
        }
    };

    const color = useColorModeValue("blue.400",  "");
    const colorDragging = useColorModeValue("blue.700", "");

    return(
        <ImageUploading
            value={images}
            onChange={handleImageUpload}
            maxNumber={1}
            dataURLKey="data_url"
        >
            {({
                  imageList,
                  onImageUpload,
                  onImageRemove,
                  isDragging,
                  dragProps,
              }) => (
                <Box className="upload__image-wrapper">
                    {!page._ipfsHashImage && !imageIsUploading &&
                    <Box border={"1px dashed"}
                         borderColor={color}
                         p={8}
                         color={isDragging ? colorDragging : color}
                         onClick={onImageUpload}
                         cursor={"pointer"}
                         {...dragProps}
                    >
                        Click or Drop image here
                    </Box>
                    }

                    {imageIsUploading && <Spinner />}

                    {page._ipfsHashImage &&
                        <Box className={"upload__image-preview"}>
                            <HStack key={0} className="image-item" alignItems={"flex-start"}>
                                <Box padding={2} borderRadius={"lg"} borderColor={color} border={"1px"}>
                                    <Image src={ipfsGateway + page._ipfsHashImage} alt="" />
                                </Box>
                                <VStack>
                                    <Tooltip
                                        placement={"top-start"}
                                        closeDelay={300}
                                        label={hasCopied ? "Copied!" : "Copy CID"}
                                    >
                                        <IconButton icon={<ImQrcode/>}
                                             onClick={onCopy}
                                             aria-label={'Copied'}
                                        />
                                    </Tooltip>)
                                    <IconButton icon={<ImBin2/>}
                                        onClick={(e) => {
                                            handleRemoveImage(e)
                                            onImageRemove(0)
                                        }}
                                        aria-label={'Remove'}
                                    />
                                </VStack>
                            </HStack>
                        </Box>
                    }
                </Box>
            )}
        </ImageUploading>
    )
}