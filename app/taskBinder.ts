import { ApplicationContext } from './applicationContext';
import { TaskController } from './taskController';
import { inbox } from "file-transfer";
import * as fs from "fs";
import { AnyARecord } from 'dns';
import { TaskEntity } from '../common/taskEntity';
import * as document from "document";

export function bindTask(appContext: ApplicationContext, controller: TaskController) {

    inbox.addEventListener("newfile", () => processNewFiles(appContext));
    processNewFiles(appContext);

    appContext.Emitter.add(ApplicationContext.OnTaskListChanged,
        (tasks: Array<TaskEntity>) => bindTaskList(tasks));

    bindTaskList(controller.getLocalTasks());
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

function processNewFiles(appContext: ApplicationContext) {
    let fileName;
    while (fileName = inbox.nextFile()) {
        // process each file
        console.log("Received: " + fileName);

        let json_object = fs.readFileSync(fileName, "json");
        console.log("JSON guid: " + json_object[2].id);

        var result = new Array<TaskEntity>();

        (<Array<any>>json_object).forEach(item => {
            var task = new TaskEntity();
            task.id = item.id;
            task.titel = item.description;

            result.push(task);
        });
        appContext.Emitter.emit(ApplicationContext.OnSyncTasks, result);
    }
}
