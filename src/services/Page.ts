import { ContentState } from 'draft-js'
export default interface BPage {
    id: any;
    title: string;
    content: ContentState;
}
