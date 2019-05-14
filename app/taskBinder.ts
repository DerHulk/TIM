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

    appContext.Emitter.add(ApplicationContext.OnTaskListChanged,
        (tasks: Array<TaskEntity>) => {
            bindTaskList(tasks)
            bindItemClick(controller);
        });

    controller.loadLocal();
    inbox.addEventListener("newfile", () => processNewFiles(appContext));
    processNewFiles(appContext);

}

function bindTaskList(tasks: TaskEntity[]) {

    console.log("[bindTaskList] Array count: " + tasks.length);

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

function bindItemClick(controller: TaskController){
    let container = document.getElementById("container");
    let list = document.getElementById("my-list");
    let items = list.getElementsByClassName("tile-list-item");

    items.forEach((element, index) => {
        let touch = element.getElementById("touch-me");
        touch.onclick = (evt) => {
            controller.selectByIndex(index);
            container.value = 0;//back to time slide
        }
    });
}

async function processNewFiles(appContext: ApplicationContext) {

    let fileName;
    while (fileName = inbox.nextFile()) {
        // process each file
        console.log("Received: " + fileName);

        let json_object = <Array<TaskStatusTuple>>fs.readFileSync(fileName, 'json');
        console.log("[processNewFiles] Array count: " + json_object.length);
              
        appContext.Emitter.emit(ApplicationContext.OnSyncTasks, json_object);
    }
}
