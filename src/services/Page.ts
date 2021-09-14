import { ContentState } from 'draft-js'
export default interface BPage {
    id?: any;
    title: string;
    content: ContentState;
    modified: Date;
}

export const blankPage = () => {
    const bp: BPage = {
        title: "new page",
        modified: new Date(),
        id: null,
        content: null
    }
    return bp;
}