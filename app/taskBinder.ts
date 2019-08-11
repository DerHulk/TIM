import { TaskController } from './taskController';
import { TaskEntity } from '../common/taskEntity';
import { IApplicationContext } from './IApplicationContext';
import * as appEvent from './constant';

export function bindTask(appContext: IApplicationContext, controller: TaskController) {

    appContext.Emitter.add(appEvent.OnTaskListChanged,
        (tasks: Array<TaskEntity>) => {
            bindTaskList(appContext, tasks);
            bindItemClick(appContext, controller);
        });

    controller.loadLocal();
    appContext.device.onNewInboxFile(() => processNewFiles(appContext));
    processNewFiles(appContext);

    appContext.Emitter.add(appEvent.OnTaskUpdated,
        (task: TaskEntity) => {
            console.log("[bindTask] send task: " + task.id + " timeInMs: " + task.timeInMs + " to output.");
            appContext.device.enqueue(task);
        });
}

function bindTaskList(appContext: IApplicationContext, tasks: TaskEntity[]) {

    console.log("[bindTaskList] Array count: " + tasks.length);

    let myList = appContext.device.getDocumentElementById("my-list");
    myList.length = tasks.length;

    if (myList.length > 0) {
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
}

function bindItemClick(appContext: IApplicationContext, controller: TaskController) {
    let list = appContext.device.getDocumentElementById("my-list");
    let items = list.getElementsByClassName("tile-list-item");

    items.forEach((element: any, index: number) => {
        let touch = element.getElementById("touch-me");
        touch.onclick = (evt: any) => {
            controller.selectByIndex(index);
        }
    });
}

export async function processNewFiles(appContext: IApplicationContext) {

    let fileName;
    while (fileName = appContext.device.getNextFileNameFromInbox()) {

        if (fileName) {
            // process each file
            console.log("Received: " + fileName);

            let companionTasks = appContext.device.readTaskListFile(fileName);
            console.log("[processNewFiles] Array count: " + companionTasks.length);

            appContext.Emitter.emit(appEvent.OnSyncTasks, companionTasks);
        }
    }
}
