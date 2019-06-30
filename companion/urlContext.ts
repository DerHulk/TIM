import { TaskEntity } from '../common/taskEntity';
import { SSL_OP_LEGACY_SERVER_CONNECT } from 'constants';
import { TaskConverter } from './taskConverter';
import { IDownloadStrategy, IUploadStrategy } from './strategyFactory';

export class UrlContext {
    url: string;
    tasks: Array<TaskEntity>
    taskConverter: TaskConverter;
    downloader: IDownloadStrategy;
    uploader: IUploadStrategy;
    save: ()=> void; 
    enqueue:(arrayBuffer: ArrayBuffer)=> void;       
}