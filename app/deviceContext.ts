import { IDeviceContext } from './IdeviceContext';
import { TaskEntity } from '../common/taskEntity';
import * as fs from "fs";
import { inbox } from "file-transfer";
import { outbox } from "file-transfer";
import { ArrayBufferHelper } from '../common/arrayBufferHelper';
import * as document from "document";
import clock from "clock";
import { display } from "display";

export class DeviceContext implements IDeviceContext {

    onDisplayChange(eventhandler: (args: any) => void): void {
        display.onchange = eventhandler;
    }
    isDisplayOn(): boolean {
        return display.on;       
    };
    onClockTick(granularity: "off" | "seconds" | "minutes" | "hours", eventhandler: (args: any) => void) {

        clock.granularity = granularity;
        clock.ontick = eventhandler;
    }

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