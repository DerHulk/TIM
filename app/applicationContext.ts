import * as fs from "fs";
import { TaskEntity } from '../common/taskEntity';

interface IEventEmitter {
    // maintain a list of listeners
    add(theEvent: string, theHandler: any): void;

    // remove a listener
    remove(theEvent: string, theHandler: any): void;

    // dispatch event to all listeners
    emit(theEvent: string, args: any): void;

}

class EventEmitter implements IEventEmitter {
    private _eventHandlers: { [id: string]: any; } = {};

    // maintain a list of listeners
    public add(theEvent: string, theHandler: any) {
        this._eventHandlers[theEvent] = this._eventHandlers[theEvent] || [];
        this._eventHandlers[theEvent].push(theHandler);
    }

    // remove a listener
    remove(theEvent: string, theHandler: any) {
        // TODO
    }

    // remove all listeners
    removeAllListeners(theEvent: string) {
        // TODO
    }

    // dispatch event to all listeners
    emit(theEvent: string, args: any) {
        var theHandlers = this._eventHandlers[theEvent];
        if (theHandlers) {
            for (var i = 0; i < theHandlers.length; i += 1) {
                theHandlers[i](args);

            }
        }
    }
}

export class ApplicationContext {

    public static OnUpdateElapseTime: string = "1d9ef731-b016-4178-baf4-2ebe2c728260";
    public static OnSyncTasks: string = "bc040a5a-2e14-4aff-af23-51d8494045f5";
    public static OnTaskListChanged: string = "cc040a5a-2e14-4aff-af23-51d8494045f5";
    public static OnTaskSelected: string = "0a115001-573f-416c-a71d-cc60b990be2d";
    
    public static MainViewIndex = 0;
    public static TaskListViewIndex = 1;

    Emitter: IEventEmitter;

    constructor() {
        this.Emitter = new EventEmitter();

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

    public WriteRecord(id: number, time: number) {
        fs.writeFileSync( id + ".txt", time, "json");
    }

    public ReadRecord(id: number) {
        try {
            return fs.readFileSync( id + ".txt", "json");
        } catch (error) {
            return new Array<TaskEntity>();
        }
    }

}