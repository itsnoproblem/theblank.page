import React, {useContext, useState} from 'react';
import ImageUploading from 'react-images-uploading';
import {Box, HStack, IconButton, Image, Spinner, Tooltip, useClipboard, VStack} from "@chakra-ui/react";
import {ImBin2, ImQrcode} from "react-icons/all";
import {EditorContext} from "../../editor-context";
import env from 'react-dotenv';

type Props = {
    fileHash: string;
    setFileHash: (hash: string) => void;
}

export const FileUpload = ({fileHash, setFileHash}: Props) => {
    const {page} = useContext(EditorContext)
    const [images, setImages] = useState([]);
    const [pageId, setPageId] = useState(page.id);
    const { hasCopied, onCopy } = useClipboard(page._ipfsHashMetadata ?? '');
    const [imageIsUploading, setImageIsUploading] = useState(false)
    const ipfsGateway = 'https://gateway.pinata.cloud/ipfs/';


    if(pageId !== page.id) {
        setPageId(page.id);
        setImages([]);
    }

    const handleRemoveImage = (e) => {
        console.log("remove image", e);
        setFileHash("");
    }

    const handleImageUpload = (imageList, addUpdateIndex) => {
        if (imageList[0] !== undefined) {
            setImageIsUploading(true);
            console.log(imageList, addUpdateIndex);
            const axios = require('axios');
            const FormData = require('form-data');
            const image = imageList[0];
            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
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
                    setFileHash(response.data.IpfsHash);
                    setImageIsUploading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setImageIsUploading(false);
                });
        }
    };

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
                         borderColor={"gray.100"}
                         p={8}
                         color={isDragging ? 'blue.100' : 'gray.100'}
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
                                <Box padding={2} borderRadius={"lg"} borderColor={"cyan.50"} border={"1px"}>
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
                                        onClick={handleRemoveImage}
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