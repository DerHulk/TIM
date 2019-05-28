import { TaskEntity } from '../common/taskEntity';
import { SSL_OP_LEGACY_SERVER_CONNECT } from 'constants';
import { TaskManager } from './taskManager';
import { IDownloadStrategy, IUploadStrategy } from './strategyFactory';

export class UrlContext {
    url: string;
    tasks: Array<TaskEntity>
    taskManager: TaskManager;
    downloader: IDownloadStrategy;
    uploader: IUploadStrategy;
    save: ()=> void; 
    enqueue:(arrayBuffer: ArrayBuffer)=> void;       
}