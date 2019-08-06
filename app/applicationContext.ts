import * as fs from "fs";
import { TaskEntity } from '../common/taskEntity';
import { IDeviceContext } from './IdeviceContext';
import { IEventEmitter } from './IEventEmitter';
import { IApplicationContext } from './IApplicationContext';
import { EventEmitter } from './EventEmitter';
import * as appEvent from './constant';

export class ApplicationContext implements IApplicationContext {


    

    public static MainViewIndex = 0;
    public static TaskListViewIndex = 1;

    Emitter: IEventEmitter;
    device: IDeviceContext;

    constructor() {
        this.Emitter = new EventEmitter();

    }

    public UpdateTaskFile(toWrite: TaskEntity) {

        console.log("[UpdateTaskFile] start...");
        var list = this.ReadTaskFile();

        list.filter(x => x.id == toWrite.id).forEach(x => {
            x.timeInMs = toWrite.timeInMs;
        });

        this.WriteTaskFile(list);      
    }

    public WriteTaskFile(toWrite: Array<TaskEntity>) {
        fs.writeFileSync("task.txt", toWrite, "json");
    }

    public ReadTaskFile(): Array<TaskEntity> {

        try {
            return fs.readFileSync("task.txt", "json");
        } catch (error) {
            return new Array<TaskEntity>();
        }
    }
}

