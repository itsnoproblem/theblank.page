import {ContentState, EditorState} from 'draft-js'

export default interface BPage {
    id?: any;
    title: string;
    content: ContentState;
    modified: Date;
    account?: string;
    address?: string;
    imageURL: string;
    _ipfsHashImage: string
    _ipfsHashMetadata?: string
    floorPrice?: number;
    royaltyPercent?: number;
}

export const blankPage = (account) => {
    const bp: BPage = {
        title: "new page",
        modified: new Date(),
        id: null,
        imageURL: "",
        _ipfsHashImage: "",
        content: null,
        account: account,
    }
    return bp;
}
