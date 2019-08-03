import { TaskEntity } from '../common/taskEntity';

export interface IDeviceContext {

    readTaskListFile(fileName:string):Array<TaskEntity>;
    getNextFileNameFromInbox():string;
    onNewInboxFile(eventhandler:()=> any):void;
    enqueue(task:TaskEntity):void; 
    
    getDocumentElementById(id:string): any;
}