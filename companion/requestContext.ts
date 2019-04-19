import { TaskSource } from '../common/enums';

export class requestContext {

constructor(
    public url?: string,
    public source?: TaskSource,
    public data?: ArrayBuffer){}
}