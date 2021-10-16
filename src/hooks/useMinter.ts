import {NFT_ABI} from "../abi/TBP";
import {Contract} from "@ethersproject/contracts";
import {useContractFunction} from "@usedapp/core";

const nftAddress = '0xceB0532a1eAe4127709089E50ee3647d00337341'; // rinkeby
const nftContract = new Contract(nftAddress, JSON.stringify(NFT_ABI));

export const useMinter = () => {
    const { state, send, events } = useContractFunction(nftContract, 'newPage', { transactionName: "Mint TBP" });
    return { state, send, events };
}


