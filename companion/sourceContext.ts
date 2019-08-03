// import { TaskEntity } from '../common/taskEntity';
// import { SSL_OP_LEGACY_SERVER_CONNECT } from 'constants';
// import { TaskConverter } from './taskConverter';
// import { IDownloadStrategy, IUploadStrategy } from './strategyFactory';

// //better rename to sourceContext
// export class SourceContext  implements ISourceContext {
//     sourceUrl: string;
//     localTasks: Array<TaskEntity>
//     taskConverter: TaskConverter;
//     downloader: IDownloadStrategy;
//     uploader: IUploadStrategy;
//     save: ()=> void; 
//     enqueue:(arrayBuffer: ArrayBuffer)=> void;       
// }

// export interface ISourceContext {
//     sourceUrl: string;
//     localTasks: Array<TaskEntity>
//     taskConverter: TaskConverter;
//     downloader: IDownloadStrategy;
//     uploader: IUploadStrategy;
//     save: ()=> void; 
//     enqueue:(arrayBuffer: ArrayBuffer)=> void;   
// }