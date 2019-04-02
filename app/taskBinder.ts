import { ApplicationContext } from './applicationContext';
import { TaskController } from './taskController';
import { inbox } from "file-transfer";
import * as fs from "fs";
import { AnyARecord } from 'dns';
import { TaskEntity } from '../common/taskEntity';
import * as document from "document";
import { ArrayBufferHelper } from '../common/arrayBufferHelper';
import { TaskStatusTuple } from '../common/taskStatusTuple';

export function bindTask(appContext: ApplicationContext, controller: TaskController) {

    inbox.addEventListener("newfile", () => processNewFiles(appContext));
    processNewFiles(appContext);

    appContext.Emitter.add(ApplicationContext.OnTaskListChanged,
        (tasks: Array<TaskEntity>) => bindTaskList(tasks));
}

function bindTaskList(tasks: TaskEntity[]) {
    let myList = <any>document.getElementById("my-list");
    myList.length = tasks.length;
    myList.delegate = {
        getTileInfo: (index: number) => {
            return {
                value: tasks[index].titel,
                index: index,
                type: "my-pool",
            };
        },
        configureTile: function (tile: any, info: any) {
            tile.getElementById("text").text = info.value;
        }
    };
}

async function processNewFiles(appContext: ApplicationContext) {
    
    let fileName;    
    while (fileName = inbox.nextFile()) {
        // process each file
        console.log("Received: " + fileName);

        let buffer = <ArrayBuffer> fs.readFileSync(fileName);           
        let json_object = ArrayBufferHelper.BufferToObject<Array<TaskStatusTuple>>(buffer);        

        appContext.Emitter.emit(ApplicationContext.OnSyncTasks, json_object);
    }
}
