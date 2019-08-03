import { IDeviceContext } from './IdeviceContext';
import { TaskEntity } from '../common/taskEntity';
import * as fs from "fs";
import { inbox } from "file-transfer";
import { outbox } from "file-transfer";
import { ArrayBufferHelper } from '../common/arrayBufferHelper';
import * as document from "document";

export class DeviceContext implements IDeviceContext {

    getDocumentElementById(id: string):any {
        return document.getElementById(id);
    }
  
    enqueue(task: TaskEntity): void {
        var buffer = ArrayBufferHelper.ObjectToBuffer(task);
        outbox.enqueue(task.id.toString(), buffer );
    }

    onNewInboxFile(eventhandler: () => any): void {
        inbox.addEventListener("newfile", eventhandler);
    }

    getNextFileNameFromInbox(): string {
        var fileName = inbox.nextFile();
        return fileName;
    }

    readTaskListFile(fileName:string): TaskEntity[] {
        let json_object = <Array<TaskEntity>>fs.readFileSync(fileName, 'json');

        return json_object;
    }
    
}