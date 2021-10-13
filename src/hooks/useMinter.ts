import {NFT_ABI} from "../abi/TBP";
import {useContractFunction} from "@usedapp/core";
import {Contract} from "@ethersproject/contracts";

const nftAddress = '0x600ca07E74E1e20a2a48A86caae6039Ed1D76A4C';
const nftContract = new Contract(nftAddress, NFT_ABI);

export const useMinter = () => {
    const { state, send } = useContractFunction(nftContract, 'mintTo', {});
    return { state, send };
}


